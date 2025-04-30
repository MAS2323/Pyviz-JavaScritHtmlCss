import { useEffect } from "react";

const useCesiumClickHandler = (viewer, onEntityClick) => {
  useEffect(() => {
    if (!viewer) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);

      if (
        Cesium.defined(pickedObject) &&
        pickedObject.id &&
        pickedObject.id.data
      ) {
        const device = pickedObject.id.data;
        onEntityClick(device, {
          x: click.position.x,
          y: click.position.y,
        });
      } else {
        onEntityClick(null);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer, onEntityClick]);
};

export default useCesiumClickHandler;
