export interface IIndicator {
  id: string;
  name: string;
}

export class Indicator implements IIndicator{
  constructor(public id: string, public name: string) {}
}
