import './style.css';
import { App } from './classes/App.ts';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);
new App();