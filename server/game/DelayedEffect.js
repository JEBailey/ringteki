/**
 * Represents a delayed card based effect.
 *
 * Properties:
 * target           - card to which this effect has been applied
 * context          - context of the ability which generated the effect
 * when             - object with event names as keys and conditions as values
 * gameAction       - gameAction to apply to target
 * message          - message to be displayed in chat with {0} as the source of the effect
 *                    and {1} as the target
 * messageArgs      - additional arguments for the message to be displayed in chat (from {2} onwards)
 * handler          - a function which resolves the effect.  Can be omited if a gameAction
 *                    is present
 */

class DelayedEffect {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.target = properties.target;
        this.context = properties.context;
        this.when = properties.when;
        this.gameAction = properties.gameAction;
        this.message = properties.message;
        this.messageArgs = properties.messageArgs;
        this.handler = properties.handler;
        this.multipleTrigger = properties.multipleTrigger;
    }

    checkEffect(events) {
        let matchingEvents = events.filter(event => this.when[event.name]);
        if(matchingEvents.length > 0) {
            if(!this.multipleTrigger) {
                this.game.effectEngine.removeDelayedEffect(this);
            }
            return matchingEvents.find(event => this.when[event.name](event, this.context));
        }
        return false;
    }

    executeHandler(event) {
        if(this.handler) {
            this.handler(event);
            return;
        }
        if(this.message) {
            let messageArgs = this.messageArgs;
            if(typeof messageArgs === 'function') {
                messageArgs = messageArgs(this.context);
            }
            if(!Array.isArray(messageArgs)) {
                messageArgs = [messageArgs];
            }
            this.game.addMessage(this.message, this.source, this.target, ...messageArgs);
        }
        if(this.gameAction && this.target) {
            this.gameAction.resolve(this.target, this.context);
        }
    }

    getDebugInfo() {
        return {
            source: this.source.name,
            target: this.target.name
        };
    }
}

module.exports = DelayedEffect;
