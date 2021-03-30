import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss'],
})
export class ElevatorComponent implements OnInit {

  floorCount: number = 10;
  eleveatorCount: number = 5;
  floorDuration: number = 500;
  availableDelay = 2000;
  elevators: Elevator[] = [];
  queueCalls: number[] = [];
  buttons: Button[] = [];
  constructor() { }

  ngOnInit(): void {
    for (let index = 0; index < this.eleveatorCount; index++) {
      this.elevators.push(new Elevator(index));
    }
    for (let index = 0; index < this.floorCount; index++) {
      this.buttons.push(new Button);
    }
    let cellHight = document.getElementsByClassName("chart").length;
  }

  callElevator(floor: number) {
    
    this.buttons[this.floorCount - 1 - floor].setBusy();

    let closestElevator = this.getClosestElevator(floor);
    if (closestElevator == -1) {
      this.queueCalls.push(floor);
    }
    else {
      this.sendElevator(closestElevator, floor);
    }
  }

  sendElevator(elevatorId: number, destination: number) {
    let location = this.elevators[elevatorId].location;
    let distance = Math.abs(destination - location);
    this.elevators[elevatorId].status = Status.Busy;

    let elevatorElm = document.getElementById("elevator" + elevatorId)!;
    elevatorElm.classList.add("filter-red");
    elevatorElm.style.transitionProperty = "margin-top"
    elevatorElm.style.transitionDuration = distance * this.floorDuration + 'ms';
    elevatorElm.style.marginTop = "-" + destination * 80 + "px";

    setTimeout(() => {
      this.elevatorArrived(elevatorId, destination, elevatorElm);
    }, distance * this.floorDuration);

  }

  elevatorArrived(elevatorId: number, location: number, elevatorElm: HTMLElement) {
    this.buttons[this.floorCount - 1 - location].setArrived();
    this.elevators[elevatorId].location = location;
    elevatorElm.classList.replace("filter-red", "filter-green");
    this.beep();

    setTimeout(() => {
      if (this.queueCalls.length > 0) {
        this.buttons[this.floorCount - 1 - location].setAvailable();
        this.sendElevator(elevatorId, this.queueCalls.shift()!);
      } else {
        this.elevatorAvailable(elevatorId, location, elevatorElm);
      }
    }, this.availableDelay);

  }
  elevatorAvailable(elevatorId: number, location: number, elevatorElm: HTMLElement) {
    elevatorElm.classList.remove("filter-green");
    this.elevators[elevatorId].status = Status.Available;
    this.buttons[this.floorCount - 1 - location].setAvailable();
  }

  beep() {
    var beepsound = new Audio('/assets/bell-ringing-05.wav');
    beepsound.play();
  }

  getClosestElevator(destination: number): number {
    let closestElevator = -1;
    let minDistance = -1;

    this.elevators.forEach(elevator => {
      if (elevator.status != Status.Available) {
        return;
      }
      let distance = Math.abs(destination - elevator.location);
      if (closestElevator == -1 || distance < minDistance) {
        closestElevator = elevator.id;
        minDistance = distance;
      }
    });
    return closestElevator;
  }


  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

}

export class Elevator {
  id: number;
  location = 0;
  status = Status.Available;
  destination = 0;
  constructor(id: number) {
    this.id = id;
  }
}

export enum Status {
  Available,
  Busy,
  Arrived
}

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