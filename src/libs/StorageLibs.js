export function addCollider(element) {
    if (element && typeof element.collide === 'function') {
        getColliders()[element.getUID()] = element;
    }
}

export function getColliders() {
    if (!document.colliders) {
        document.colliders = {};
    }

    return document.colliders;
}

export function addTickable(element) {
    if (element && typeof element.tickEvent === 'function') {
        getTickable()[element.getUID()] = element;
    }
}

export function getTickable() {
    if (!document.tickable) {
        document.tickable = {};
    }

    return document.tickable;
}


export async function startTickEvent() {
    var startTime = performance.now();
    var prevTime = performance.now();

    while (true) {
        const tickable = getTickable();
        await sleep(10);
        for (let i = 0; i < Object.keys(tickable).length; i++) {
            const key = Object.keys(tickable)[i];
            const item = tickable[key];
            if (item && typeof item.tickEvent === 'function') {
                item.tickEvent({time: startTime - performance.now(), delta: prevTime - performance.now()});
            }
            prevTime = performance.now();
        }
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
