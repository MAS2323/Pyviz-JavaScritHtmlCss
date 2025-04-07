export const STATUS_COLORS = {
  active: Cesium.Color.GREEN.withAlpha(0.8),
  warning: Cesium.Color.YELLOW.withAlpha(0.8),
  critical: Cesium.Color.RED.withAlpha(0.9),
  offline: Cesium.Color.GRAY.withAlpha(0.5),
  maintenance: Cesium.Color.BLUE.withAlpha(0.6),
};

export const updateModelAppearance = (entity, status) => {
  if (!entity.model) return;

  // Cambia color base
  entity.model.color = STATUS_COLORS[status] || STATUS_COLORS.offline;

  // Efectos especiales por estado
  if (status === "critical") {
    entity.model.silhouetteColor = Cesium.Color.RED;
    entity.model.silhouetteSize = 1.5;
  }
};
