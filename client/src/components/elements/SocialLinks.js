import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons';

export default function SocialLinks(props) {
    return (
        <div className={ 'd-flex ' + (props.containerClass || '') + (props.large ? ' flex-column' : '') + (props.addClass ? (' ' + props.addClass) : '') }>
            {props.discord &&
                <a href={props.discord} target="_blank" className={'d-flex align-center btn ' + (props.linkClass || '') + (props.large ? ' btn-primary' : ' btn-icon flex-grow')}>
                    <FontAwesomeIcon icon={faDiscord} className={props.large ? 'mr-2' : ''} />{props.large ? ' Join Discord' : ''}
                </a>
            }
            {props.telegram &&
                <a href={props.telegram} target="_blank" className={'d-flex align-center btn ' + (props.linkClass || '') + (props.large ? ' btn-primary' : ' btn-icon flex-grow')}>
                    <FontAwesomeIcon icon={faTelegram} className={props.large ? 'mr-2' : ''} />{props.large ? '  Join Telegram' : ''}
                </a>
            }
            {props.twitter &&
                <a href={props.twitter} target="_blank" className={'d-flex align-center btn ' + (props.linkClass || '') + (props.large ? ' btn-primary' : ' btn-icon flex-grow')}>
                    <FontAwesomeIcon icon={faTwitter} className={props.large ? 'mr-2' : ''} />{props.large ? '  Join Twitter' : ''}
                </a>
            }
            {props.whitepaper &&
                <a href={props.whitepaper} target="_blank" className={'d-flex align-center btn ' + (props.linkClass || '') + (props.large ? ' btn-primary' : ' btn-icon flex-grow')}>
                    <FontAwesomeIcon icon={faBook} className={props.large ? 'mr-2' : ''} />{props.large ? ' Read Whitepaper' : ''}
                </a>
            }
            {props.instagram &&
                <a href={props.instagram} target="_blank" className={'d-flex align-center btn ' + (props.linkClass || '') + (props.large ? ' btn-primary' : ' btn-icon flex-grow')}>
                    <FontAwesomeIcon icon={faInstagram} className={props.large ? 'mr-2' : ''} />{props.large ? ' Join Instagram' : ''}
                </a>
            }
        </div>
    )
}
