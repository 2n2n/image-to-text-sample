class ViewPort {
    // get first text detected in the viewport
    async getTextInsideViewPort(viewPortViewRef, elBounds) {
        return new Promise((resolve, reject) => {
            try {
                viewPortViewRef.measure((a, b, width, height, px, py) => resolve({
                    x: px,
                    y: py,
                    width,
                    height,
                }))
            }
            catch (e){ 
                reject(false);
            }
            
        })
    }
    // get all text that was capured in viewport.
    getTextsInsideViewPort() { }
}

export default ViewPort;
