import React, { useState, useEffect } from 'react';
import classes from './TypeWriter.module.scss';
const Typewriter = ({ texts, typingSpeed, erasingSpeed, delay }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (texts && texts.length > 0) {
            const currentText = texts && texts[currentTextIndex];

            if (currentText) {
                const speed = isTyping ? typingSpeed : erasingSpeed;
                let timeout;

                if (isTyping) {
                    timeout = setTimeout(() => {
                        setIsTyping(false);
                    }, delay);
                } else {
                    timeout = setTimeout(() => {
                        setIsTyping(true);
                        setCurrentIndex(0);
                        // Move to the next text in the array
                        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
                    }, delay);
                }

                const interval = setInterval(() => {
                    if (isTyping) {
                        if (currentIndex <= currentText.length) {
                            setDisplayText(currentText.slice(0, currentIndex));
                            setCurrentIndex(currentIndex + 1);
                        }
                    } else {
                        if (currentIndex >= 0) {
                            setDisplayText(currentText.slice(0, currentIndex));
                            setCurrentIndex(currentIndex - 1);
                        }
                    }
                }, speed);

                return () => {
                    clearTimeout(timeout);
                    clearInterval(interval);
                };
            }
        }
    }, [texts, typingSpeed, erasingSpeed, delay, currentTextIndex, currentIndex, isTyping]);

    return (
        <div className="typeWriter" data-testid="typewriter-wrapper">
            <span className={`${classes['typeWriter__text']}`}>{displayText}</span>
            <span className={`${classes['typeWriter__cursor']}`}>|</span>
        </div>
    );
};

export default Typewriter;
