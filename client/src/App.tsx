import React, { FormEventHandler, useCallback, useState } from 'react';
import './App.css';
import "ka-table/style.scss";
import { Table, useTable, useTableInstance } from 'ka-table';
import { DataType, EditingMode, SortingMode } from 'ka-table/enums';
import Modal from 'react-modal';
import { format } from 'date-fns';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function App() {
  const [dataArray, setDataArray] = React.useState<{ id: Number; name : string; description: string; start_date_UTC: Date; end_date_UTC: Date }[]>();
  const [newEvent, setNewEvent] = React.useState<{name: string; description: string; startDate: string; endDate: string}>( {
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  React.useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setDataArray(data));
  }, []);

  const onNewEventChanged = React.useCallback((e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewEvent((iEvent) => {
      if (!iEvent) {
        return {
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          [e.target.name]: e.target.value,
        };
      }
      return {
        ...iEvent,
        [e.target.name]: e.target.value,
      };
    });
  }, [])

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  
  const [selectedId, changeSelectedId] = useState<Number>();
  const selectedData = selectedId && dataArray?.find(d => d.id === selectedId);
  const table = useTable({
      onDispatch: (action, tableProps) => {
          if (action.type === 'SelectSingleRow'){
              changeSelectedId(action.rowKeyValue);
          }
          if (action.type === 'DeselectAllRows'){
              changeSelectedId(undefined);
          }
      },
  });

  const AddButton = () => {
    const table = useTableInstance();
    return (
      <div className='plus-cell-button'>
          <img
              src='src/plus.svg'
              alt='Add'
              title='Add'
              onClick={() => openModal()}
          />
      </div>
    );
  };
  
  
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newEvent) {
      return false;
    }

    // POST request using fetch() 
    fetch("/api/events", { 
          
      // Adding method type 
      method: "POST", 
        
      // Adding body or contents to send 
      body: JSON.stringify({ 
          name: newEvent.name, 
          description: newEvent.description, 
          startDate: newEvent.startDate,
          endDate: newEvent.endDate 
      }), 
        
      // Adding headers to the request 
      headers: { 
          "Content-type": "application/json; charset=UTF-8"
      } 
    })

    // Converting to JSON 
    .then(response => response.json()) 

    // Displaying results to console 
    .then((json : { newEventId: Number }) => {
      const newData = {
        id: json.newEventId,
        name : newEvent.name,
        description: newEvent.description, 
        start_date_UTC: new Date(newEvent.startDate),
        end_date_UTC: new Date(newEvent.endDate),
      }
      setDataArray((iDataArray) => iDataArray ? [...iDataArray, newData] : [newData] ) 
      setNewEvent({
        name: "",
        description: "",
        startDate: "",
        endDate: ""
      });

      closeModal();
    });

    return false;
  }, [newEvent]);

  

  return (
    <div className="App">
      <Table
        columns={[
          { key: 'name', title: 'Name', dataType: DataType.String },
          { key: 'description', title: 'Description', dataType: DataType.String },
          { key: 'start_date_UTC', title: 'Start', dataType: DataType.Date },
          { key: 'end_date_UTC', title: 'End', dataType: DataType.Date },
          {
            key: 'addColumn',
            style: {width: 53}
        },
        ]}
        data={dataArray}
        rowKeyField={'id'}
        sortingMode={SortingMode.Single}
        selectedRows={[selectedId]}
        childComponents={{
          dataRow: {
            elementAttributes: () => ({
              onClick: (event, extendedEvent) => {
                  table.selectSingleRow(extendedEvent.childProps.rowKeyValue);
              },
            }),
          },
          headCell: {
            content: (props) => {
              if (props.column.key === 'addColumn'){
                return <AddButton />;
              }
            }
          }
        }}
      />
      {selectedData && (
        <div className='info'>
          <div>
            Selected: 
            {selectedData.name} 
            ({selectedData.description})
            <button
              onClick={() => {
                table.deselectAllRows();
              }}
            >
              Deselect
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>New event</h2>
        <button onClick={closeModal}>close</button>

        <form onSubmit={onSubmit}>
          <input name='name' value={newEvent?.name} maxLength={32} onChange={onNewEventChanged}/>
          <textarea name='description' maxLength={255} value={newEvent?.description} onChange={onNewEventChanged}></textarea>
          <input name='startDate' aria-label="Date and time" type="datetime-local" value={newEvent?.startDate} onChange={onNewEventChanged}/>
          <input name='endDate' aria-label="Date and time" type="datetime-local" value={newEvent?.endDate} onChange={onNewEventChanged}/>
          
          <button type='submit'>
            save
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default App;
