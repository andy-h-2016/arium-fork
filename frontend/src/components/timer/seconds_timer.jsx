import React from 'react';
const INTERVAL = 1000 * 15 //TIME IN MILLISECONDS


class SecondsTimer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {countdown: 0}
    this.setCountdown = this.setCountdown.bind(this);
    this.setCountdown();
    this.levelCalculatedOnLogin = false;

  }

  componentDidMount() {
    const id = this.props.currentUser.id || this.props.currentUser._id;
    this.props.fetchUserTerrarium(id);
    this.props.fetchUserWaterTracker(id);
    

    const timerId = Math.random();
    this.intervalID = setInterval( () => {
      this.calculateTerrariumLevels();
      this.setCountdown();
    }, INTERVAL); 
  }

  componentDidUpdate() {
    //only want this to run on the first update after componentDidMount runs
    //on the first update after 
    if ((this.levelCalculatedOnLogin === false) && this.props.waterTracker && this.props.terrarium ) {
      console.log('UPDATING SGDPI9UHASDFPIOHJSFD')
      this.levelCalculatedOnLogin = true;
      this.calculateTerrariumLevels()
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    clearInterval(this.countdownID);
  }

  setCountdown() {
    this.setState({countdown: INTERVAL / 1000})
    let countdown = this.state.countdown;
    clearInterval(this.countdownID)

    this.countdownID = setInterval( () => {
      if (countdown > 0) {
        this.setState({countdown: this.state.countdown - 1})
      } else {
        this.setCountdown()
      }
    }, 1000)
  }

  calculateTerrariumLevels() {
    let {waterTracker, terrarium, currentUser} = this.props;
    let secondsElapsed = this.secondsCounter();
    let isTerrariumMaxed;
    let isTerrariumMin;
    let timePeriods = 1;

    // if (true) { //THIS LINE IS USED IF WE ARE NOT KEEPING TRACK OF TIME ONCE THE USER CLOSES THE APP
    if (secondsElapsed > (INTERVAL / 1000)) {              // THIS LINE KEEPS TRACK OF TIME WHILE USER IS AWAY
      timePeriods = Math.floor(secondsElapsed / (INTERVAL / 1000)); //THIS LINKE KEEPS TRACK OF TIME WHILE USER IS AWAY
      switch (true) {
        case waterTracker.today >= currentUser.goal:
          let increase = (waterTracker.streak > 1) ? 2 : 1;
          waterTracker.streak += 1;
          if (terrarium.level === 30) {
            isTerrariumMaxed = true
          } else if (terrarium.level + increase > 30) {
            terrarium.level = 30;
          } else {
            terrarium.level += increase;
          }

          if (timePeriods > 1) {
            terrarium.level = (terrarium.level - (timePeriods -1)) < 1 ? 1 : (terrarium.level - (timePeriods -1))
            waterTracker.streak = 0;
          }
          break
          
        case waterTracker.today >= Math.floor(.5 * currentUser.goal):
          //terrariumlevel += 0; no change.
          waterTracker.streak = 0;
          break
            
        case waterTracker.today < Math.floor(.5 * currentUser.goal):
          if (terrarium.level === 1) {
            isTerrariumMin = true
          } else if (terrarium.level - timePeriods < 1) {
            terrarium.level = 1
          } else {
            terrarium.level -= timePeriods;
          }
          waterTracker.streak = 0;
          break
      }       
      waterTracker.today = 0;
      this.props.updateWaterTracker(waterTracker)
      .then(() => {
        if (isTerrariumMaxed || isTerrariumMin) {
          return
        } else {
          this.props.updateTerrarium(terrarium);
        }
      })
      .then(() => this.forceUpdate());   
    }
  }
          
  secondsCounter() {
    const currentDate = new Date();
    const lastActiveDate = new Date(localStorage.getItem('lastActiveDate'));
    let secondsElapsed;
    
    if (lastActiveDate) {
    const msElapsed = currentDate.getTime() - lastActiveDate.getTime();
    // daysElapsed = msElapsed / (1000 * 60 * 60 * 24) //convert ms to days
    secondsElapsed = msElapsed / (1000) //convert ms to seconds
  } else {
    secondsElapsed = 0; 
  }

    localStorage.setItem('lastActiveDate', currentDate);

    return secondsElapsed;
  }

  render() {
    return(
      <div className='timer'>
        <p className='timer-title'>Time to Next Terrarium Update</p>
        <p className='timer-value'>{this.state.countdown}</p>
      </div>
    )
  }

}

export default SecondsTimer;