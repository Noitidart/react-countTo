// ACTIONS
const ADD_COUNTER = 'ADD_COUNTER';
const REMOVE_COUNTER = 'REMOVE_COUNTER';
const SET_COUNTER = 'SET_COUNTER';
const TRANSITION_COUNTER = 'TRANSITION_COUNTER';

// ACTION CREATORS
var next_counterid = 0;
function addCounter(transition, duration, end, val=0) {
	return {
		type: ADD_COUNTER,
		counterid: next_counterid++,
		transition,
		val,
		end,
		duration
	}
}

function removeCounter(counterid) {
	return {
		type: REMOVE_COUNTER,
		counterid
	}
}

function setCounter(counterid, val) {
	return {
		type: SET_COUNTER,
		counterid,
		val
	}
}

function transCounter(counterid, end) {
	return {
		type: TRANSITION_COUNTER,
		counterid,
		end
	}
}
// REDUCERS
/* state shape
	const initialState = {
				counters: [
					{
						val - integer
						duration - integer(ms)
						end - integer
						transition - array of 4 or string linear/ease/ease-in/ease-out/ease-in-out
					}
				]
			}
*/
function counters(state=[], action) {
	switch (action.type) {
		case ADD_COUNTER:
			var { transition, val, end, duration, counterid } = action;
			return [
				...state,
				{ transition, val, end, duration, counterid }
			];
		case REMOVE_COUNTER:
			return state.filter(counter => counter.counterid !== action.counterid);
		case SET_COUNTER:
			return state.map(counter => {
				if (counter.counterid === action.counterid) {
					return Object.assign({}, counter, {
						val: action.val
					});
				} else {
					return counter;
				}
			});
		case TRANSITION_COUNTER:
			return state.map(counter => {
				if (counter.counterid === action.counterid) {
					return Object.assign({}, counter, {
						end: action.end
					});
				} else {
					return counter;
				}
			});
		default:
			return state;
	}
}
const app = Redux.combineReducers({
	counters
});
// STORE
var store = Redux.createStore(app);

var unsubscribe = store.subscribe(() =>
	console.log(store.getState())
)

// REACT COMPONENTS - PRESENTATIONAL
var App = () => {
	return React.createElement('div', null,
		React.createElement('div', undefined,
			React.createElement('a', { href:'javascript:void(0)', onClick:function(){store.dispatch(addCounter('ease', 5000, 200))} }, 'Add Counter')
		),
		React.createElement(CountersContainer)
	);
};

var Counters = React.createClass({
	remove: function(counterid) {
		store.dispatch(removeCounter(counterid));
	},
	trans: function(counterid, val) {
		store.dispatch(transCounter(counterid, val));
	},
	render: function() {
		var { counters } = this.props; // redux

		return React.createElement('ul', {  },
			counters.map(counter => {
				var { transition, duration, val, end, counterid } = counter;
				return React.createElement('li', undefined,
					React.createElement('div', { style:{float:'right'} },
						React.createElement('a', { href:'javascript:void(0)', onClick:this.remove.bind(this, counterid) }, 'Remove'),
						' ',
						React.createElement('a', { href:'javascript:void(0)', onClick:this.trans.bind(this, counterid, 50) }, 'Trans 50'),
						' ',
						React.createElement('a', { href:'javascript:void(0)', onClick:this.trans.bind(this, counterid, 200) }, 'Trans 200'),
						' ',
						React.createElement('a', { href:'javascript:void(0)', onClick:this.trans.bind(this, counterid, 300) }, 'Trans 300'),
						' ',
						React.createElement('a', { href:'javascript:void(0)', onClick:this.trans.bind(this, counterid, 400) }, 'Trans 400')
					),
					React.createElement(CountTo, { transition, duration, val, end, counterid })
				);
			})
		);
	}
});

// REACT COMPONENTS - CONTAINER
var CountersContainer = ReactRedux.connect(
	function mapStateToProps(state) {
		return {
			counters: state.counters
		}
	}
)(Counters);

// startup
window.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(
		React.createElement(ReactRedux.Provider, { store },
			React.createElement(App)
		),
		document.getElementById('root')
	);
}, false);
