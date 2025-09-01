export class Geo{
  constructor(
    public lat: number,
    public lng: number,
  ) {
  }
}


export class Product{
  public textStatus:string = 'Ενεργό';

  constructor(
    public id: number,
    public title: string,
    public description: string,
    public address: string,
    public geolocation: Geo,
    public status: number,
    public image: string,
    public category: string,
    public availableUntil: string,
  ) {
    if (this.status === 2) {
        this.textStatus = 'Ανενεργό';
    } else if (status === 3) {
        this.textStatus = 'Έχει δωθεί';
    } 
  }
}
