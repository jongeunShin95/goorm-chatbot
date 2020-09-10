import React, { useEffect } from 'react';
import Axios from 'axios';

function Chatbot() {
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
        } catch(e) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
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

    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto'}}>

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