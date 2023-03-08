import { useRef, useState } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function QuizCard() {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    return (
            <>
                <Button ref={target} onClick={() => setShow(!show)}>
                Click me!
                </Button>
                <Overlay target={target.current} show={show} placement="right">
                    {(props) => (
                        <Tooltip id="overlay-example" {...props}>
                        My Tooltip
                        </Tooltip>
                    )}
                </Overlay>
            </>
        );
}

export default QuizCard;