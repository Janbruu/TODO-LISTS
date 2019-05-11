import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    // initial state
    this.state = {
      lists: [],
      newToDo: {
        text: ""
      },
      toEdit: {
        id: ''
      }
    };

    // binded methods goes here...
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.removeToDo = this.removeToDo.bind(this);
    this.toEdit = this.toEdit.bind(this);
    this.closeEditTodo = this.closeEditTodo.bind(this);
    this.addEditedTodo = this.addEditedTodo.bind(this);
    this.markTodo = this.markTodo.bind(this);
  }

  handleChange(e) {
    e.preventDefault();

    // re-write yung text with the e.target.value
    this.setState({
      newToDo: {
        text: e.target.value
      }
    });
  }

  addTodo(e) {
    e.preventDefault();

    this.setState(prevState => {
      return {
        // we use prevState to access the latest state.
        // saka tayo gagamit nung concat para i-dagdag yung bagong todo sa lists
        lists: prevState.lists.concat({
          id: prevState.lists.length + 1,
          text: prevState.newToDo.text,
          isCompleted: false,
        }),

        // ito yung bumubura sa value nung input field.
        newToDo: {
          text: ''
        }
      };
    });
  }

  removeToDo(id) {
    // function for filter.
    function filterOutTODO(list) {
      // 
      return list.id !== id;
    }

    this.setState({
      // filter accepts function and 
      // it will automatically pass the item for each item inside the lists array 
      lists: this.state.lists.filter(filterOutTODO)
    });
  }

  closeEditTodo() {
    this.setState({
      toEdit: {
        id: ''
      }
    })
  }

  toEdit(todo) {
    this.setState({
      toEdit: todo
    })
  }

  addEditedTodo(e) {
    e.preventDefault();

    this.setState(prevState => ({
      lists: prevState.lists.map(list => {
        // dito natin inaalam kung tugma ba yung list.id sa prevState.toEdit.id
        if(list.id === prevState.toEdit.id) {
          // kapag tugma then babaguhin yung text value inside the list object into prevState.toEdit.text
          list.text = prevState.toEdit.text
        }

        return list;
      }),
      toEdit: {}
    }));
  }

  markTodo(id) {
    this.setState({
      lists: this.state.lists.map(todo => {
        // dito natin inaalam kung tugma ba yung todo.id sa pinasang id dito sa markTodo na method.
        if(todo.id === id) {
          // kinukuha nito yung previous value nung todo.isCompleted and then
          // saka niya binabaliktad yung boolean value and then
          // re-assign sa todo.isCompleted 
          todo.isCompleted = !todo.isCompleted;
        }

        return todo;
      })
    })
  }

  render() {

    /* 
      toEditFields
        - tumatanggap itong function nang tatlong arguments
          save - handler for save button (method)
          close - handler for close button (method)
          textConfig - para to sa input field (object)
    */
    function toEditFields(save, close, textConfig) {
      return (
        <span>
          <input 
            type="text" 
            value={textConfig.value} 
            onChange={textConfig.onChange} 
          />
          {/* 
            it validates if textConfig.value is empty string
              kapag empty string siya magiging true yung value nung disabled
              kapag hindi empty string magiging false yung value nung disabled 
          */}
          <button onClick={save} disabled={textConfig.value === ""}>Save</button>
          <button onClick={close}>Close</button>
        </span>
      );
    }

    return (
      <div>
        <h1>Todo</h1>
        {/* 
          kinukuha natin yung value from state para ma-control yung input field 
          using yung this.handleChange */}
        <input
          onChange={this.handleChange}
          type="text"
          placeholder="Make Coffee"
          value={this.state.newToDo.text}
        />
        {/* it validates the this.state.newToDo.text if empty string
          kapag empty string siya magiging true yung value nung disabled
          kapag hindi empty string magiging false yung value nung disabled
        */}
        <button 
          onClick={this.addTodo} 
          disabled={this.state.newToDo.text === ""}>
            Add new ToDo
          </button>

        <ul>
          {/* 
            gumagamit tayo nang map para ma display yung bawat list sa loob nang this.state.lists 
          */}
          {this.state.lists.map((todo, index) => (
            // kailangan natin i-specify yung 'key' kapag gagamit nang loop to dispaly jsx.
            <li key={index}>
              <input type="checkbox" onChange={() => this.markTodo(todo.id)} />
              {
                // it validates this.state.toEdit.id if equal to todo.id
                this.state.toEdit.id === todo.id 
                ?
                // if equal
                toEditFields(
                  this.addEditedTodo, 
                  this.closeEditTodo, 
                  {
                    // kinukuha natin yung text value nang toEdit para i display sa edit input field.
                    value: this.state.toEdit.text,
                    onChange: 
                      // ito yung handler nang edit input field.
                      e => {
                        let val = e.target.value;

                        this.setState(prevState => ({
                          toEdit: {
                            // this statement below will retain the previous value of toEdit
                            // re-writes the text property with 'val'
                            ...prevState.toEdit,
                            text: val
                          }
                        })
                    )}
                  }
                )
                :
                // if not equal
                <span>
                    <span style={{ 
                        marginRight: 20,
                        // if todo.isCompleted ay true
                        // then ang textDecoration is "line-through"
                        // else ang textDecoration is "none" 
                        textDecoration: todo.isCompleted ? "line-through" : "none" 
                    }}>{todo.text}</span>
                    {/* pinapasa natin yung todo 'object' once this button is clicked.  */}
                    <button onClick={() => this.toEdit(todo)} disabled={todo.isCompleted}>Edit</button>
                    {/* pinapasa natin yung todo 'id' once this button is clicked. */}
                    <button onClick={() => this.removeToDo(todo.id)}>Delete</button>
                  </span>
              }
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
