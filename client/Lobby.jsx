import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

import * as actions from './actions';
import Avatar from './Avatar.jsx';

class InnerLobby extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);

        this.state = {
            message: ''
        };
    }

    componentDidUpdate() {
        $(this.refs.messages).scrollTop(999999);
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    render() {
        var index = 0;
        var messages = _.map(this.props.messages, message => {
            if(!message.user) {
                return;
            }

            var timestamp = moment(message.time).format('MMM Do H:mm:ss');
            return (
                <div key={timestamp + message.user.username + (index++).toString()}>
                    <Avatar emailHash={message.user.emailHash} float />
                    <span className='username'>{message.user.username}</span><span>{timestamp}</span>
                    <div className='message'>{message.message}</div>
                </div>);
        });

        var users = _.map(this.props.users, user => {
            return (
                <div>
                    <Avatar emailHash={user.emailHash} />
                    <span>{user.name}</span>
                </div>
            );
        });

        return (
            <div>
                <div className='alert alert-info'>
                    <div><span className='icon-intrigue' />2017-01-21: New cards: Jon Snow(Core), Old Bear Mormont, Verteran Builder.  Fix Fealty in the deck builder.  Attempt to fix the reconnection issues some of you have been having.  This is an issue with the library we use for server communication but was made worse by how we were using it.  Hopefully this will make it better.</div>
                    <div><span className='icon-military' />2017-01-19: New cards: King's Hunting Party, Vanguard Lancer, Aeron Damphair, Balon Greyjoy, The Kraken's Grasp, Cersei Lannister (Core), Joffrey Baratheon (Core), Doran Martell, The Red Viper, Dornish Paramour, Palace Spearman, The Queen's Assassin, Snowed Under, Rains of Autumn.   Duplicates are no longer considered in play for card effects.  Fixed timing of plot revealed events.  Fixed Jory Cassel triggering for non unique non starks.</div>
                    <div><span className='icon-power' />2017-01-16: New card: Stannis Baratheon (Core).  The Haunted Forest no longer applies its STR bonus when kneeled.  Take control effects no longer make cards 'stuck'.  Effects that kill when a card's STR reaches 0 no longer cause an infinite loop.  Harrenhall (stark version) no longer triggers for non characters.  Plots now show tokens correctly, making Power Behind The Throne work properly.  Margery Tyrell's effect has been corrected to be end of round.  Arya Stark's reaction is now a proper optional reaction.  Added /give-icon and /take-icon commands.  See about page for usage.</div>                    
                </div> 
                <div className='row'>
                    <span className='col-sm-9 text-center'><h1>Play A Game Of Thrones 2nd Edition</h1></span>
                    <span className='col-sm-3 hidden-xs'><h3>{'Online Users (' + users.length + ')'}</h3></span>
                </div>
                <div className='row'>
                    <div className='lobby-chat col-sm-9'>
                        <div className='panel lobby-messages' ref='messages'>
                            {messages}
                        </div>
                    </div>
                    <div className='panel user-list col-sm-3 hidden-xs'>
                        {users}
                    </div>
                </div>
                    <div className='row'>
                        <form className='form form-hozitontal'>
                            <div className='form-group'>
                                <div className='chat-box col-sm-5 col-xs-9'>
                                    <input className='form-control' type='text' placeholder='Chat...' value={this.state.message}
                                        onKeyPress={this.onKeyPress} onChange={this.onChange} />
                                </div>
                                <button type='button' className='btn btn-primary col-sm-1 col-xs-2' onClick={this.onSendClick}>Send</button>
                            </div>
                        </form>
                    </div>
            </div>);
    }
}

InnerLobby.displayName = 'Lobby';
InnerLobby.propTypes = {
    messages: React.PropTypes.array,
    socket: React.PropTypes.object,
    users: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        messages: state.chat.messages,
        socket: state.socket.socket,
        users: state.games.users
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
