import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Meesage from './Sections/Message'

function Chatbot() {

    const dispatch = useDispatch();
    const messageFromRedux = useSelector(state => state.message.messages);

    useEffect(() => {
        eventQuery('Welcome2')
    }, [] );

    const textQuery = async (text) => {
        let conversation = {
            who: 'user',
            'content': {
                text: {
                    text: text
                }
            }
        }
        console.log(conversation);
        dispatch(saveMessage(conversation));
        const textQueryVariables = {
            text
        }
        
        try {
            const res = await Axios.post('/api/dialogflow/textQuery', textQueryVariables);
            const content = res.data.fulfillmentMessages[0];
            conversation = {
                who: 'bot',
                content: content
            }
            console.log(conversation);
            dispatch(saveMessage(conversation));
        } catch(e) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation));
            console.log(conversation);
        }

    }

    const eventQuery = async (event) => {
        const eventQueryVariables = {
            event
        }
        
        try {
            const res = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables);
            const content = res.data.fulfillmentMessages[0];
            let conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation));
            console.log(conversation);
        } catch(e) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation));
            console.log(conversation);
        }

    }

    const keyPressHandler = (e) => {
        if (e.key === "Enter") {
            if (!e.target.value) {
                return alert('you need to type something first');
            }

            textQuery(e.target.value);

            e.target.value = "";
        }
    }

    const renderOneMessage = (message, i) => {
        console.log("message:  " , message);

        return <Meesage key={i} who={message.who} text={message.content.text.text} />
    }

    const renderMessage = (returnedMessages) => {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i);
            })
        } else {
            return null;
        }
    }

    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto'}}>

                {renderMessage(messageFromRedux)}

            </div>
            <input 
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHandler}
                type="text"
            /> 
        </div>
    )
}

export default Chatbot;