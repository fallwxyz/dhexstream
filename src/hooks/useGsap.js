import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsap = () => {
    const comp = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => { }, comp);
        return () => ctx.revert();
    }, []);

    return { comp, gsap, ScrollTrigger };
};

export const animatePageIn = (element) => {
    if (!element) return;
    gsap.fromTo(element,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
};
