import { Status } from "./Status";

export class Button {
    text = "Call";
    status = Status.Available;
    setBusy() {
      this.status = Status.Busy;
      this.text = "Waiting";
    }
    setArrived() {
      this.status = Status.Arrived;
      this.text = "Arrived";
    }
    setAvailable()
    {
      this.status = Status.Available;
      this.text = "Call";
    }
  }