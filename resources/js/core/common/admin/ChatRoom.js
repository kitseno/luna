import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ChatService} from '../../services'
import User from '../../models/User'

import '../styles/ChatRoom.css'

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatRoomOpen: false,
            users: [],
            typing: [],
            unread: 0,
            messages: [
                {
                    sender: 'Room',
                    text: 'Welcome to the chatroom.'
                },
            ],
        }
    }

    componentDidMount() {

        let timer;

        Echo.join('chatroom')
        .here((users) => {
            //
            this.setState({users: users});
        })
        .joining((user) => {
            const users = this.state.users;
            users.push(user);

            this.setState({users: users});
        })
        .leaving((user) => {
            const users = this.state.users;

            _.remove(users, (u) => { return u.id == user.id });

            this.setState({users: users});

        })
        .listen('.message.new', (e) => {

            const messages = this.state.messages;
            let unread = this.state.unread;

            messages.push(e);

            if (e) {
                unread = unread + 1;
            }

            this.setState({messages: messages});
            this.setState({unread: unread});

            this.scrollToBottom();

        }).listenForWhisper('typing', (e) => {

            const typing = this.state.typing;

            if (!typing.includes(e.first_name)) {
                typing.push(e.first_name);
            }

            this.setState({typing: typing});

            clearTimeout(timer);
            timer = setTimeout( () => {
                this.setState({typing: []});
            }, 300);

        });
        
    }

    componentWillUnmount() {
        Echo.leave('chatroom');
    }

    sendMessage = (e) => {

        e.preventDefault();

        const { dispatch } = this.props
        const message = document.getElementById('message').value;

        if (message)
        dispatch(ChatService.sendMessage(message))
            .then((res)  => {
                const messages = this.state.messages;
                messages.push({text:message, sender: 'You'});
                this.setState({messages: messages});

                // Scroll to bottom
                this.scrollToBottom();
            })
            .catch(({error, statusCode}) => {
                console.log(error)
            })

        // Clear input field
        document.getElementById('message').value = '';
    }

    userTyping = () => {

        setTimeout( () => {
            Echo.join('chatroom')
                .whisper('typing', {
                    first_name: this.props.user.first_name
                });
          }, 300);
        
    }

    scrollToBottom = () => {
        const elem = document.getElementById('messages');
        elem.scrollTop = elem.scrollHeight;
    }

    handleToggle = () => {

        let chatRoomOpen = this.state.chatRoomOpen;
        this.setState({chatRoomOpen: !chatRoomOpen}, () => {
            this.scrollToBottom();
            this.setState({unread: 0});
        });
    }

    render() {
        return (
            <div style={{position: 'relative', zIndex: '1000'}}>
                <div className={"main pt-2 pl-2 pr-2 pb-1 "+(this.state.chatRoomOpen ? 'd-none':'d-block')} onClick={this.handleToggle}>
                    <span className="bp3-icon-standard bp3-icon-chat mr-2"></span>
                    Chatroom 
                    {
                        this.state.unread > 0 && <span className="badge badge-danger ml-1">{this.state.unread}</span>
                    }
                </div>

                <div className={"chatbox "+(this.state.chatRoomOpen ? 'd-block' : 'd-none')}>
                    <button className="btn btn-link" style={{position: 'absolute', top: '-30px', right: '-10px'}}  onClick={this.handleToggle}>Close</button>
                    <div className="d-flex flex-row align-items-stretch" style={{height:'80%'}}>
                        <div style={{flex: '1 auto'}} className="d-flex flex-row">
                            <div id="messages" className="align-self-stretch" style={{padding: '10px', marginBottom: '10px', borderRight: 'solid 1px gainsboro', overflow:'scroll', width: '100%', wordBreak: 'break-all'}}>
                            {
                                this.state.messages && this.state.messages.map( (message, key) => {
                                    return (
                                        <div key={key}>{message.sender}: {message.text}</div>
                                    )
                                })
                            }
                            </div>
                        </div>
                        <div style={{flex: '1 2'}} className="p-2">
                        {
                            this.state.users && this.state.users.map( (user, key) => {
                                return (
                                    <div key={key}>{user.first_name}</div>
                                )
                            })
                        }
                        </div>
                    </div>
                    <div>
                        <div className="ml-2">
                        {
                            this.state.typing.length > 0 && this.state.typing.join(', ') + " "+ (this.state.typing.length > 1 ? 'are': 'is') +" typing ..."
                        }
                        &nbsp;
                        </div>
                        <form onSubmit={(e) => {this.sendMessage(e)}} className="d-flex align-items-center pl-2 pr-2">
                            <input
                                className="bp3-input mr-2"
                                type="text"
                                id="message"
                                name="message"
                                defaultValue=""
                                placeholder="Type message here"
                                onKeyPress={this.userTyping}
                                style={{flex: '1 auto'}}
                                dir="auto" />
                            <button
                                type="submit"
                                className="bp3-button bp3-intent-primary"
                                onClick={(e) => {this.sendMessage(e)}}>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
            
}

const mapStateToProps = state => {
    return {
        user: new User(state.Auth.user),
    }
};

export default connect(mapStateToProps)(ChatRoom)