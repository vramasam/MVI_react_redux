import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import './index.css';
import { createStore } from 'redux';

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        onStart: () => { dispatch ({type: 'START'});},
        onStop: () => { dispatch ({type: 'STOP'})},
    };
}

// View, gets Updated Model as input again
let Stopwatch = connect(mapStateToProps, mapDispatchToProps) ((props) =>   {
    let minutes = Math.floor(props.time / 60);
    let seconds = props.time - (minutes * 60);
    let secondFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;

    return <div><p>{minutes}:{secondFormatted}</p>
    <button onClick= {props.running ? props.onStop : props.onStart}>
    {props.running ? 'Stop' : 'Start'}</button></div>;
});

const intents = {
    TICK: 'TICK',
    START: 'START',
    STOP: 'STOP',
    RESET: 'RESET'
}

// intent(may be user intent or self intent) , that acts on model.
const update = ( model = {running : false,
    time : 0}, action) =>  {
    const updates = {
        'START': (model) => Object.assign({}, model, {running: true}),
        'STOP': (model) => Object.assign({}, model, {running: false}),
        'TICK': (model) => Object.assign({}, model, {time: model.time + (model.running ? 
            1 : 0)})
    };
    return (updates[action.type] || (() => model)) (model);
};

let container = createStore(update);

ReactDOM.render(
    <Provider store={container}>
      <Stopwatch /> 
    </Provider>, document.getElementById('root'));
setInterval(() => {
    container.dispatch({type : 'TICK'});
}, 1000)

