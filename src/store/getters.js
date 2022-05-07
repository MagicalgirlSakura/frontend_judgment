const getters={
  //entity
  nodes: state=>state.entity.entityList,
  modify_node_visible: state=>state.entity.modify_node_visible,
  add_node_visible: state=>state.entity.add_node_visible,
  entity_types: state=>state.entity.entityTypes,
  entity_distance: state=>state.entity.entity_distance,
  r_circle: state=>state.entity.entity_radius,
  fixed: state=>state.entity.drag_fixed,
  current_node:state=>state.entity.current_node,
  enableUpdate:state=>state.entity.enableUpdate,
  load_compelete:state=>state.entity.load_compelete,
  entity_text_font_size:state=>state.entity.entity_text_font_size,
  force_or_not:state=>state.entity.force_or_not,
  boundary_check_or_not:state=>state.entity.boundary_check_or_not,
  //排版模式？
  type_setting_mode:state=>state.entity.type_setting_mode,
  //relationships
  links: state=>state.relation.relationList,
  modify_relation_visible:state=>state.relation.modify_relation_visible,
  add_relation_visible:state=>state.relation.add_relation_visible,
  link_text_font_size: state=>state.relation.link_text_font_size,
  link_text_visible: state=>state.relation.link_text_visible,
  //ERGraph
  ERData:state=>state.ERGraph.ERData,
  //pages
  loading_visible:state=>state.pages.loading_visible,
  answer_module_visible:state=>state.pages.answer_module_visible,
  answer_text:state=>state.pages.answer_text,
}
export default getters;
