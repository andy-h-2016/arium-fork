import React from 'react';
import {daysCounter, getLocalDateTimeStrings} from '../../util/time_utils';
const INTERVAL = 1000 * 60; //60 seconds converted to milliseconds

class DayTimer extends React.Component {
  constructor(props) {
    super(props);
    const dateTime = getLocalDateTimeStrings();
    this.state = dateTime;

    this.setClock = this.setClock.bind(this);
    this.days = this.days.bind(this);

    this.setClock();
    this.levelCalculatedOnLogin = false;
  }

  componentDidMount() {
    const id = this.props.currentUser.id || this.props.currentUser._id;
    
    Promise.all([
      this.props.fetchUserTerrarium(id),
      this.props.fetchUserWaterTracker(id)
    ]).then( () => {
      //upon load, calculateTerrariumLevels based on last user activity timestamp
      //then, save new user activity timestamp
      this.calculateTerrariumLevels();

      //set up interval to calculate terrarium levels
      // this.intervalID = setInterval(() => this.calculateTerrariumLevels(), INTERVAL); 
    })
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    clearInterval(this.countdownID);
  }

  // visual clock
  setClock() {
    clearInterval(this.countdownID)

    this.countdownID = setInterval( () => {
      const {date, time} = getLocalDateTimeStrings();
      if (time === '12:00:00 AM') {this.calculateTerrariumLevels()}

      this.setState({date, time})
    }, 1000)
  }


  calculateTerrariumLevels() {
    
    let {waterTracker, terrarium, currentUser} = this.props;
    let daysElapsed = this.days();
    console.log('time', new Date())
    console.log('days Elapsed', daysElapsed)
    if (daysElapsed > 0) {
      switch (true) {
        case waterTracker.today >= currentUser.goal:
          let increase = (waterTracker.streak > 1) ? 2 : 1;
          waterTracker.streak += 1;
          if (terrarium.level + increase > 30) {
            terrarium.level = 30;
          } else {
            terrarium.level += increase;
          }
          break
        case waterTracker.today >= Math.floor(.5 * currentUser.goal):
          //terrariumlevel += 0; no change.
          waterTracker.streak = 0;
          break
        case waterTracker.today < Math.floor(.5 * currentUser.goal):
          if (terrarium.level === 1) {
            terrarium.level = 1;
          } else {
            terrarium.level -= 1;
          }
          waterTracker.streak = 0;
          break
      }
      
      //if user has not been active for over 2 days
      if (daysElapsed > 1) {
        //Lose a level for each day not active. 
        //Subtract a day since the first day's results are calculated in the switch statement above
        const levelsDecrease = daysElapsed - 1;
        if (terrarium.level - levelsDecrease < 1) {
          terrarium.level = 1; 
        } else {
          terrarium.level -= levelsDecrease;
        }
        waterTracker.streak = 0;
      }

      waterTracker.today = 0;
      this.props.updateWaterTracker(waterTracker)
        .then(() => this.props.updateTerrarium(terrarium))
        .then(() => this.forceUpdate());   
    }
  }

  days() {
    let terrarium = this.props.terrarium;
    const currentDate = new Date();
    const lastActiveDate = new Date(terrarium.lastActiveDate);
    console.log('terrarium.lastActiveDate', terrarium.lastActiveDate)
    // const lastActiveDate = new Date(localStorage.getItem('lastActiveDate'));
    let daysElapsed;

    if (lastActiveDate) {
      daysElapsed = daysCounter(lastActiveDate, currentDate)

      // daysElapsed = msElapsed / (1000 * 60 * 60 * 24) //convert ms to days
    } else {
     daysElapsed = 0; 
    }
    
    terrarium.lastActiveDate = currentDate;
    this.props.updateTerrarium(terrarium);
    console.log('days Elapsed: ', daysElapsed)
    console.log('time: ', currentDate)

    // localStorage.setItem('lastActiveDate', currentDate);
    

    return daysElapsed;
  }

  render() {
    return(
      <div className='timer'>
        <div className='hourglass-container'>
          <div className='hourglass'></div>
        </div>
        <div className='date'>{this.state.date}</div>
        <div className='time'>{this.state.time}</div>
      </div>
    )
  }

}

export default DayTimer;