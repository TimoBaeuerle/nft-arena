import React, { useEffect } from 'react'
import $ from 'jquery';

export default function Modal(props) {
    useEffect(() => {
        $(document).on('click', '[data-modal="'+props.id+'"]', function() {
            $('#'+props.id).css('display', 'flex');
            setTimeout(function() {
                $('#'+props.id).css('opacity', '1');
            }, 50);
        });
        if (props.closable != false) {
            $(document).on('click', '#'+props.id+' span.close', function() {
                $('#'+props.id).css('opacity', '0');
                setTimeout(function() {
                    $('#'+props.id).css('display', 'none');
                }, 300);
            });
            $(document).on('click', function(event) {
                var modal = document.getElementById(props.id);
                if (event.target == modal) {
                    $(modal).css('opacity', '0');
                    setTimeout(function() {
                        $(modal).css('display', 'none');
                    }, 300);
                }
            });
        }
    }, []);

    return (
        <div id={props.id} className={'modal ' + (props.className ? props.className : '')} style={props.open ? {display: 'flex', opacity: '1'} : {}}>
            <div className="modal-content">
                {props.closable != false &&
                    <span className="close">&times;</span>
                }
                {props.title &&
                    <div className="text-center">
                        <h2 className="mt-2">{props.title}</h2>
                    </div>
                }
                {props.children &&
                    <div className="modal-children">
                        {props.children}
                    </div>
                }
            </div>
        </div>
    )
}
