import React from 'react';
import './Dictionary.css';
import { URL } from './constants';
import { getWords } from './getWords.js';

class Dictionary extends React.Component {
  constructor(props) {
    super(props);
    this.audio = null;
    this.state = {
      content: 'Please select a category',
      category: 1,
      count: 0,
    };
  }

  componentDidMount() {
    document.title = `Results page ${this.state.count}`;
  }
  componentDidUpdate() {
    document.title = `Results page ${this.state.count}`;
  }

  playAudioWords(audioSrc) {
    if (!this.audio) {
      this.audio = new Audio(audioSrc);
      this.audio.play();
      this.audio.addEventListener('ended', () => {
        this.audio = null;
      });
      console.log(audioSrc);
    }
  }

  getNewWords = (data, category) => {
    let words = [];
    let transcriptions = [];
    let translations = [];
    let audios = [];
    data.forEach((item) => {
      words.push(item.word);
      transcriptions.push(item.transcription);
      translations.push(item.wordTranslate);
      audios.push(item.audio);
    });
    words = words.map((item, index) => (
      <div>
        <span> {item} </span>
        <span className='transcription'> {transcriptions[index]} </span>
        <span> {translations[index]} </span>
        <button
          onClick={() => {
            this.playAudioWords(`${URL}${audios[index]}`);
          }}>
          Spell IT
        </button>
      </div>
    ));
    this.setState({
      content: words,
      category: category,
      count: 1,
    });
  };

  getNextWords = (data, counter) => {
    // const URL = "https://raw.githubusercontent.com/alexeikravchuk/rslang-data/master/";
    if (this.state.count < 1) {
      this.setState({
        count: 0,
      });
    } else if (this.state.count < 30) {
      let words = [];
      let transcriptions = [];
      let translations = [];
      let audios = [];
      data.forEach((item) => {
        words.push(item.word);
        transcriptions.push(item.transcription);
        translations.push(item.wordTranslate);
        audios.push(item.audio);
      });
      words = words.map((item, index) => (
        <div>
          <span> {item} </span>
          <span className='transcription'> {transcriptions[index]} </span>
          <span> {translations[index]} </span>
          <button
            onClick={() => {
              this.playAudioWords(`${URL}${audios[index]}`);
            }}>
            Spell IT
          </button>
        </div>
      ));
      this.setState({
        content: words,
        count: counter + 1,
      });
    } else {
      this.setState({
        count: 30,
      });
    }
  };

  handleCategory = (categoryNumber) => {
    getWords(0, categoryNumber).then((data) => {
      this.getNewWords(data, categoryNumber);
    });
  };

  handleMoreWords = () => {
    getWords(this.state.count, this.state.category).then((data) => {
      this.getNextWords(data, this.state.count);
    });
  };

  render() {
    return (
      <div className='wrapper'>
        <h2>Word Categories</h2>
        <p className='select-category'>
          <i>Select a category</i>
        </p>
        <div className='category'>
          <a onClick={() => this.handleCategory(0)} href='#anchor'>
            category1
          </a>
          <a onClick={() => this.handleCategory(1)} href='#anchor'>
            category2
          </a>
          <a onClick={() => this.handleCategory(2)} href='#anchor'>
            category3
          </a>
          <a onClick={() => this.handleCategory(3)} href='#anchor'>
            category4
          </a>
          <a onClick={() => this.handleCategory(4)} href='#anchor'>
            category5
          </a>
          <a onClick={() => this.handleCategory(5)} href='#anchor'>
            category6
          </a>
        </div>
        <h2 id='anchor'>Essential english words</h2>
        <div className='dictionaryPage'>{this.state.content}</div>
        <button className='show'>
          <a onClick={() => this.handleMoreWords()} className='more' href='#anchor'>
            Show more words
          </a>
        </button>
        <p className='page'>Results page {this.state.count}</p>
      </div>
    );
  }
}

export default Dictionary;
