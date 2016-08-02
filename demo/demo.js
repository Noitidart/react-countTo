// ACTIONS
const ADD_COUNTER = 'ADD_COUNTER';
const REMOVE_COUNTER = 'REMOVE_COUNTER';
const MODIFY_COUNTER = 'MODIFY_COUNTER';

// ACTION CREATORS
var next_counterid = 0;
function addCounter(transition, duration, end, mountval) {
	if (mountval === undefined) {
		mountval = parseInt(document.getElementById('initial_value').value);
	}
	return {
		type: ADD_COUNTER,
		counterid: next_counterid++,
		transition,
		mountval,
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

function modifyCounter(counterid, prop, val) {
	return {
		type: MODIFY_COUNTER,
		counterid,
		prop,
		val
	}
}

// REDUCERS
/* state shape
	const initialState = {
				counters: [
					{
						mountval - integer
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
			var { transition, mountval, end, duration, counterid } = action;
			return [
				...state,
				{ transition, mountval, end, duration, counterid }
			];
		case REMOVE_COUNTER:
			return state.filter(counter => counter.counterid !== action.counterid);
		case MODIFY_COUNTER:
			var { counterid, prop, val } = action;
			return state.map(counter => {
				if (counter.counterid === counterid) {
					return Object.assign({}, counter, {
						[prop]: val
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
			'Click "Add Counter" to add a counter. Then modify the text box value of "Count To" and hit your "Enter" key to see the change.',
			React.DOM.br(),
			'When you add a counter, it will count to "123" using one of three random css easing functions are ued, "ease", "ease-in", or one generated from ',
			React.createElement('a', { href:'http://cubic-bezier.com/#0,0,.16,1.9' },
				'cubic-bezier.com (0,0,.16,1.9)'
			),
			'.',
			React.DOM.br(),
			React.DOM.br(),
			React.createElement('a', { href:'javascript:void(0)', onClick:()=>store.dispatch(addCounter(['linear', 'ease', [0,0,.16,1.9]][Math.floor(Math.random() * 3)], 2000, 123)) },
				'ADD COUNTER'
			),
			' Initial Value: ',
			React.createElement('input', { type:'text', id:'initial_value', defaultValue:'100' }),
			React.DOM.br(),
			React.DOM.br()
		),
		React.createElement(CountersContainer)
	);
};

var Counters = React.createClass({
	remove: function(counterid) {
		store.dispatch(removeCounter(counterid));
	},
	modify: function(counterid, prop, e) {
		var input = e.target;
		var val;
		if (input.value.includes(',')) {
			// if they have comma, then it is probably 4 numbers for css easing params
			val = input.value.split(',').map(el=>parseFloat(el));
		} else {
			val = input.value;
		}
		store.dispatch(modifyCounter(counterid, prop, val));
	},
	keydown: function(e) {
		if (e.keyCode == 13) {
			e.target.blur();
		}
	},
	render: function() {
		var { counters } = this.props; // redux

		return React.createElement('ul', {  },
			counters.map(counter => {
				var { transition, duration, mountval, end, counterid } = counter;
				return React.createElement('li', { key:counterid },
					React.createElement('div', { style:{float:'right',clear:'both'} },
						React.createElement('a', { href:'javascript:void(0)', onClick:this.remove.bind(this, counterid) }, 'Remove'),
						' CSS Easing: ',
						React.createElement('input', { type:'text', defaultValue:transition, onBlur:this.modify.bind(this, counterid, 'transition'), onKeyDown:this.keydown }),
						' Count To: ',
						React.createElement('input', { type:'text', defaultValue:end, size:6, onBlur:this.modify.bind(this, counterid, 'end'), onKeyDown:this.keydown }),
						' Duration (ms): ',
						React.createElement('input', { type:'text', defaultValue:duration, size:6, onBlur:this.modify.bind(this, counterid, 'duration'), onKeyDown:this.keydown })
					),
					React.createElement(CountTo, { transition, duration, mountval, end, counterid })
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
