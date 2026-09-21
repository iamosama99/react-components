import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './VirtualList.css';

const OVERSCAN = 3;
const END_THRESHOLD = 5;

type Props = {
    count: number;
    itemHeight: number;
    renderItem: (index: number) => ReactNode;
    onEndReached?: () => void;
};

export default function VirtualList({ count, itemHeight, renderItem, onEndReached }: Props) {
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        setViewportHeight(el.clientHeight);

        const observer = new ResizeObserver(() => {
            setViewportHeight(el.clientHeight);
        });
        observer.observe(el);

        return () => observer.disconnect();
    },[])

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
    const end = Math.min(count, Math.ceil((scrollTop + viewportHeight) / itemHeight) + OVERSCAN);

    const indexes = Array.from({ length: end - start }, (_, i) => start + i);

    useEffect(() => {
        if (count > 0 && end >= count - END_THRESHOLD) onEndReached?.();
    }, [end, count]);

    return (
        <div ref={ref} className="virtual-list" onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
            <div className="virtual-list-spacer" style={{height: count * itemHeight}}>
                {indexes.map((index) => (
                    <div
                        key={index}
                        className="virtual-list-row"
                        style={{top: index * itemHeight, height: itemHeight}}
                    >
                        {renderItem(index)}
                    </div>
                ))}
            </div>
        </div>
    )
}
