import { useState, useEffect } from 'react'
export default {
    hook: (store) => () => {
        const [x, setX] = useState(store.value)
        useEffect(()=> {
            const sub = store.subscribe({next: (v) => setX(v)})
            return () => sub.unsubscribe()
        }, [])
        return x
    }
} 