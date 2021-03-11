const processUnits = (units, materials) => {

    materials = materials.map((i) => ({
      ...i,
      type: i.material.type,
    }));
    for (let unit of units) {
      unit.show = true
      unit.content = materials.filter((i) => i.unit.id === unit._id);

      let order = (unit.order || []).reverse();
      unit.content.sort((a, b) => {
        let a_order = order.indexOf(a.id);
        let b_order = order.indexOf(b.id);
        return b_order - a_order;
      });
    }
    return  units;

}

export { processUnits }