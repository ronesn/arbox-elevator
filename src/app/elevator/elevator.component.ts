import { Component } from '@angular/core';
import { Button } from './Button';
import { Elevator } from './Elevator';
import { Status } from './Status';
@Component({
  selector: 'elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss'],
})
export class ElevatorComponent  {

  floorCount: number = 10;
  eleveatorCount: number = 5;
  floorDuration: number = 500; //time in ms between floors
  availableDelay = 2000;      //time in ms waiting when elevator arrived
  elevators: Elevator[] = [];
  queueCalls: number[] = [];
  buttons: Button[] = [];
  
  constructor() { //init elevators and buttons arrays

    for (let index = 0; index < this.eleveatorCount; index++) {
      this.elevators.push(new Elevator(index));
    }
    for (let index = 0; index < this.floorCount; index++) {
      this.buttons.push(new Button);
    }
  }
  
/**
 * when button click call the closest elevator
 * @param floor the floor number
 */
  callElevator(floor: number) {
    
    this.buttons[this.floorCount - 1 - floor].setBusy();

    let closestElevator = this.getClosestElevator(floor);
    if (closestElevator == -1) { //all the elevators are busy -> add to queue
      this.queueCalls.push(floor);
    }
    else {
      this.sendElevator(closestElevator, floor);
    }
  }
/**
 * send elevtor to requested floor
 * @param elevatorId 
 * @param destination  requested floor
 */
  sendElevator(elevatorId: number, destination: number) {
    let location = this.elevators[elevatorId].location;
    let moveDuration = Math.abs(destination - location) * this.floorDuration;
    this.elevators[elevatorId].status = Status.Busy;
    
    //move the elevator to destination
    let elevatorElm = document.getElementById("elevator" + elevatorId)!; 
    elevatorElm.classList.add("filter-red");
    elevatorElm.style.transitionProperty = "margin-top"
    elevatorElm.style.transitionDuration = moveDuration + 'ms';
    elevatorElm.style.marginTop = "-" + destination * 80 + "px";

    setTimeout(() => { //wait until the elevator arrived
      this.elevatorArrived(elevatorId, destination, elevatorElm);
    }, moveDuration);

  }
/**
 * Change button and elevator to Arrived style and play arrived sound
 * @param elevatorId 
 * @param location 
 * @param elevatorElm 
 */
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
  /**
   * Change button and elevator to Available style
   * @param elevatorId 
   * @param location 
   * @param elevatorElm 
   */
  elevatorAvailable(elevatorId: number, location: number, elevatorElm: HTMLElement) {
    elevatorElm.classList.remove("filter-green");
    this.elevators[elevatorId].status = Status.Available;
    this.buttons[this.floorCount - 1 - location].setAvailable();
  }
/**
 * play bell-ringing
 */
  beep() {
    let beepsound = new Audio('/assets/bell-ringing-05.wav');
    beepsound.play();
  }
/**
 *  get closest available elevator
 * @param destination 
 * @returns elevator Id or -1 if all elevators are busy
 */
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
}
