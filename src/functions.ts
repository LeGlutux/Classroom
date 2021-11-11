

import alarm_clock from './images/Icons/alarm_clock.png'
import backpack from './images/Icons/backpack.png'
import book from './images/Icons/book.png'
import calculator from './images/Icons/calculator.png'
import checkmark from './images/Icons/checkmark.png'
import old_phone from './images/Icons/old_phone.png'
import pen from './images/Icons/pen.png'
import phone from './images/Icons/phone.png'
import plus from './images/Icons/plus.png'
import signature from './images/Icons/signature.png'
import smiley from './images/Icons/smiley.png'
import stop from './images/Icons/stop.png'
import supply from './images/Icons/supply.png'
import supply2 from './images/Icons/supply2.png'
import thumbs_down from './images/Icons/thumbs_down.png'
import thumbs_up from './images/Icons/thumbs_up.png'
import timer from './images/Icons/timer.png'
import warning from './images/Icons/warning.png'
import help from './images/Icons/help.png'





export const handleIcon = (iconNumber: number) => {
    if (iconNumber === 1) return alarm_clock
    if (iconNumber === 2) return backpack
    if (iconNumber === 3) return book
    if (iconNumber === 4) return calculator
    if (iconNumber === 5) return checkmark
    if (iconNumber === 6) return old_phone
    if (iconNumber === 7) return pen
    if (iconNumber === 8) return phone
    if (iconNumber === 9) return plus
    if (iconNumber === 10) return signature
    if (iconNumber === 11) return smiley
    if (iconNumber === 12) return stop
    if (iconNumber === 13) return supply
    if (iconNumber === 14) return supply2
    if (iconNumber === 15) return thumbs_down
    if (iconNumber === 16) return thumbs_up
    if (iconNumber === 17) return timer
    if (iconNumber === 18) return warning
    if (iconNumber === 19) return help
    else return 'none'
}