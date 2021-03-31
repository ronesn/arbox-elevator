import { Status } from "./Status";

export class Elevator {
    id: number;
    location = 0;
    status = Status.Available;
    destination = 0;
    constructor(id: number) {
      this.id = id;
    }
  }