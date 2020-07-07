import React, { Component} from 'react';
import { withStyles, Button, Avatar, LinearProgress, Backdrop  } from '@material-ui/core';
import shuffle from '../../helpers/shuffle';
import getWords from '../../helpers/getWords';
import { apiData } from '../../constants/constants';
import defaultAudioImage from '../../../../assets/default-audiocall.png';
import correctSound from '../../../../assets/correct.mp3';
import errorSound from '../../../../assets/error.mp3';
import answerCorrect from '../../../../assets/correct.png';
import answerWrong from '../../../../assets/wrong.png';
import { amber } from '@material-ui/core/colors';
import { AboutGame } from '../AboutGame';
import { Statistics } from '../Statistics';

class MainGame extends Component{
  constructor(props) {
    super(props);
    this.state ={
      image: defaultAudioImage,
      audio: null,
      translates: [],
      gameWords: [],
      currentWord: 'word',
      showAnswer: 'none',
      answerImage: answerCorrect,
      correctNumber: 5,
      roundClear: false,
      gameButton: 'Не знаю',
      variants: [],
      progress: 0,
      correctAnswers: [], 
      wrongAnswers: [],
      gameFinish: false,

    }
    this.playCurrentAudio = this.playCurrentAudio.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.finishGame = this.finishGame.bind(this);
    
  }

// async getWords(page, category){
//   const url = `${wordsData}page=${page - 1}&group=${category - 1}`;
//   const response = await fetch (url);
//   const data = await response.json();
//   return data;
// }

playAudio(src) {
  if (!this.audio) {
    this.audio = new Audio(src);
    this.audio.play();
    this.audio.addEventListener('ended', () => { this.audio = null; });
  }
}

componentDidMount(){
  this.generateGame();
}

generateGame(){
  document.addEventListener("keydown", this.handleKeyDown, false);
  getWords(this.props.round, this.props.difficulty).then((data) => {  
    data.forEach(el => {
      this.state.translates.push(el.wordTranslate)
    })
      let gameWords = shuffle(data).slice(0, 10);
      console.log(gameWords)
      this.setState({ gameWords: gameWords });
      this.setState({ currentWord: this.state.gameWords[0].word });
      this.playCurrentAudio();
      this.createVariants();
  })
}

createVariants(){
  this.setState({ variants: [] });
  let currentWord =  this.state.translates.indexOf(this.state.gameWords[0].wordTranslate)
  this.state.translates.splice(currentWord, 1);
  let variants = shuffle(this.state.translates).slice(0,4);
  variants.push(this.state.gameWords[0].wordTranslate); 
  let showVariants = shuffle(variants);
  this.setState({ variants: showVariants });

}

checkAnswer(opt){
    let selectedAnswer = this.state.variants[opt];
    let correctAnswer = this.state.gameWords[0].wordTranslate;

    this.setState({roundClear: true})
    this.setState({gameButton: '→'})
    this.setState({ correctNumber: opt });
    this.setState({ showAnswer: 'block' });
    this.setState({ image: `${apiData}${this.state.gameWords[0].image}` });
    
  if(selectedAnswer === correctAnswer){
    this.setState({ 
      correctAnswers: this.state.correctAnswers.concat([this.state.gameWords[0]])
    })
    this.setState({answerImage: answerCorrect});
    this.playAudio(correctSound);
  } else {
    this.setState({ 
      wrongAnswers: this.state.wrongAnswers.concat([this.state.gameWords[0]])
    })
    this.setState({answerImage: answerWrong})
    this.playAudio(errorSound);
  }
}

nextRound(){
  if(this.state.gameButton === 'Не знаю'){
    this.setState({ 
      wrongAnswers: this.state.wrongAnswers.concat([this.state.gameWords[0]])
    })
  }
    this.setState({ progress: this.state.progress + 10 })
  if(this.state.gameWords.length > 1 ){
    this.setState({ roundClear: false });
    this.setState({gameButton: 'Не знаю'})
    this.setState({ showAnswer: 'none' });
    this.setState({ image: defaultAudioImage });
    this.setState({ correctNumber: 5 });
    this.state.gameWords.shift();
    this.setState({ gameWords: this.state.gameWords });
    this.setState({ currentWord: this.state.gameWords[0].word });
    this.playCurrentAudio()
    this.createVariants()
  } else {
    this.setState({ gameFinish: true });
  }
}

playCurrentAudio(){
  this.playAudio(`${apiData}${this.state.gameWords[0].audio}`)

}

handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    this.nextRound()
  }
  if (e.key === '1') {
    this.checkAnswer(0)
  }
  if (e.key === '2') {
    this.checkAnswer(1)
  }
  if (e.key === '3') {
    this.checkAnswer(2)
  }
  if (e.key === '4') {
    this.checkAnswer(3)
  }
  if (e.key === '5') {
    this.checkAnswer(4)
  }
}


finishGame(){
  this.generateGame();
  this.setState({
    gameFinish: false,
    progress: 0,
    correctAnswers: [], 
    wrongAnswers: [],
  });
}

render(){
  const { classes } = this.props;
  let show;
  const gameFinish = this.state.gameFinish;
    
  if (!gameFinish) {
    show = 
    <div className={classes.root} >
      <Avatar className={classes.large} alt="Current word image" src={this.state.image} onClick={this.playCurrentAudio} />
      <div style = {{ display: this.state.showAnswer}}>{this.state.currentWord}</div>
      <div className={classes.variants}>
        <Avatar className={classes.small} src={this.state.answerImage} style={{display: this.state.correctNumber === 0  ? 'block' : 'none'}}/>
        <ColorButton disabled={this.state.roundClear} variant="outlined" color="primary" onClick={() => this.checkAnswer(0)}>
          1 {this.state.variants[0]}
        </ColorButton>
        <Avatar className={classes.small}  src={this.state.answerImage} style={{display: this.state.correctNumber === 1  ? 'block' : 'none'}}/>
        <ColorButton disabled={this.state.roundClear} variant="outlined" color="primary" onClick={() => this.checkAnswer(1)}>
          2 {this.state.variants[1]}
        </ColorButton>
        <Avatar className={classes.small} src={this.state.answerImage} style={{display: this.state.correctNumber === 2  ? 'block' : 'none'}}/>
        <ColorButton disabled={this.state.roundClear} variant="outlined" color="primary" onClick={() => this.checkAnswer(2)}>
          3 {this.state.variants[2]}
        </ColorButton>
        <Avatar className={classes.small} src={this.state.answerImage} style={{display: this.state.correctNumber === 3  ? 'block' : 'none'}}/>
        <ColorButton disabled={this.state.roundClear} variant="outlined" color="primary" onClick={() => this.checkAnswer(3)}>
          4 {this.state.variants[3]}
        </ColorButton>
        <Avatar className={classes.small} src={this.state.answerImage} style={{display: this.state.correctNumber === 4  ? 'block' : 'none'}}/>
        <ColorButton disabled={this.state.roundClear} variant="outlined" color="primary" onClick={() => this.checkAnswer(4)}>
          5 {this.state.variants[4]}
        </ColorButton>
      </div>
      <div>
        <Button variant="contained" onClick={this.nextRound}>{this.state.gameButton} </Button>
      </div>

      <div>
        <Button variant="contained" color="secondary" onClick={this.props.gameEnds}>Back</Button>
      </div>
      <div className={classes.progress}>
        <LinearProgress  variant="determinate" value={this.state.progress} />   
      </div>
      <AboutGame />

    </div>

  } else {
    show = <Statistics {...this.state} finishGame = {this.finishGame}/>;

  }

   return(
    <Backdrop className={classes.backdrop} open={true}>
      {show}
    </Backdrop>
    )    
 };
}

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(amber[500]),
    backgroundColor: amber[500],
    '&:hover': {
      backgroundColor: amber[700],
    },
  },
}))(Button);


function createStyles(theme) {
  return {
    root: {
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    variants: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      '& > *': {
        margin: theme.spacing(2),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    margin: {
      height: theme.spacing(3),
    },
    progress: {
      width: '100%'
    }
  };
}

export default withStyles(createStyles)(MainGame);
