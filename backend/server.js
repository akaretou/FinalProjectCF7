const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true,
    })
);

app.use(
    session({
        name: "sid",
        secret: process.env.SESSION_SECRET || "dev-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

mongoose
    .connect("mongodb://127.0.0.1:27017/leaveit")
    .then(async () => {
        console.error("MongoDB connected");
        // we want to have access to site as admins
        // so we create the admin user if not exists

        const adminEmail = "admin@leaveit.test";
        const amdin_user = await User.findOne({ email: adminEmail });

        if (!amdin_user) {
            const password = "123456";
            const hashed = await bcrypt.hash(password, 12);
            const admin = new User({
                firstname: "Admin",
                lastname: "User",
                email: adminEmail,
                mobile: "6969696969",
                password: hashed,
                role: "admin",
            });

            await admin.save();
            console.log("Admin user createed:", adminEmail, "password", password);
        }
    })
    .catch((err) => console.error("MongoDB error:", err));

const db = mongoose.connection;

const uploadsDir = path.join(__dirname, "..", "frontend", "public", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const hash = crypto.randomBytes(16).toString("hex");
        cb(null, hash + ext);
    },
});

function imageFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Επιτρέπεται να ανεβάσετε μόνο αρχεία εικόνας"), false);
    }
    cb(null, true);
}

const upload = multer({ storage, imageFilter: imageFilter });

function authRequired(req, res, next) {
    if (!req.session.userId) {
        return res.sendStatus(401);
    }
    next();
}

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Λάθος στοιχεία σύνδεσης" });
        }

        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(401).json({ error: "Λάθος στοιχεία σύνδεσης" });
        }

        req.session.regenerate((err) => {
            if (err) {
                return res.sendStatus(500);
            }
            req.session.userId = user._id;
            res.json({});
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.sendStatus(500);
        res.clearCookie("sid");
        res.sendStatus(204);
    });
});

app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, mobile, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Υπαρχει ήδη λογαριασμός με αυτό το email" });
        }

        const hashed = await bcrypt.hash(password, 12);

        const user = new User({
            firstname,
            lastname,
            email,
            mobile,
            password: hashed,
        });

        await user.save();
        res.json({ message: "Ο χρήστης δημιουργήθηκε" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/me", async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId });

    if (!user) {
        return res.status(401).json({});
    }

    res.json({});
});

app.get("/me/listings", authRequired, async (req, res) => {
    try {
        const userId = req.session.userId;

        const products = await Product.find({ user: userId });

        res.json({ listings: products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/me/listings", authRequired, upload.single("image"), async (req, res) => {
    try {
        const { title, description, address, latitute, longitute, status, category } = req.body;

        const product = new Product({
            title,
            description,
            address,
            geolocation: {
                lat: parseFloat(latitute),
                lng: parseFloat(longitute),
            },
            status: parseInt(status, 10),
            category,
            user: req.session.userId,
        });

        if (req.file) {
            product.image = req.file.filename;
        }

        await product.save();

        res.json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.put("/me/listing/:id", authRequired, upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            user: req.session.userId,
        });

        if (!product) {
            return res.status(404).json({});
        }

        const { title, description, address, latitute, longitute, status, category, removeImage } = req.body;

        if (title) {
            product.title = title;
        }
        if (description) {
            product.description = description;
        }
        if (address) {
            product.address = address;
        }
        if (latitute && longitute) {
            product.geolocation = {
                lat: parseFloat(latitute),
                lng: parseFloat(longitute),
            };
        }
        if (status) {
            product.status = parseInt(status, 10);
        }
        if (category) {
            product.category = category;
        }

        if (removeImage) {
            if (product.image) {
                const oldPath = path.join(__dirname, product.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            product.image = '';
        }
        if (req.file) {
            const fs = require("fs");
            const path = require("path");

            if (product.image) {
                const oldPath = path.join(__dirname, product.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            product.image = req.file.filename
        }

        await product.save();

        res.json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/me/listing/:id", authRequired, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            user: req.session.userId,
        });

        if (!product) {
            return res.status(404).json({ error: "To προϊόν δεν βρέθηκε" });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/me/listing/:id", authRequired, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            user: req.session.userId,
        });

        if (!product) {
            return res.status(404).json({ error: "To προϊόν δεν βρέθηκε" });
        }

        if (product.image) {
            const imagePath = path.join(uploadsDir, product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.deleteOne();

        res.json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/listings", async (req, res) => {
    try {
        1;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const total = await Product.countDocuments();

        const listings = await Product.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.json({
            listings,
            pages: Math.ceil(total / perPage),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/listings/map", async (req, res) => {
    try {
        const { north, south, east, west } = req.query;

        // convert params to numbers
        const n = parseFloat(north);
        const s = parseFloat(south);
        const e = parseFloat(east);
        const w = parseFloat(west);

        // query by bounding box
        const listings = await Product.find({
            "geolocation.lat": { $gte: s, $lte: n },
            "geolocation.lng": { $gte: w, $lte: e },
        });

        res.json({
            listings,
            pages: 1, // no pagination here unless you want it
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/listing/:id", (req, res) => {
    const listing = listings.find((l) => l.id === Number(req.params.id));
    if (!listing) return res.status(404).json({ message: "Not found" });
    res.json(listing);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
