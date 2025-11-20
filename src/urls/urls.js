import { getUserIdFromLocalStorage } from '../data/localStorage';


const selectedGatewayId = localStorage.getItem("selectedGatewayId");


// const API_Base_url = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const API_Base_url = import.meta.env.VITE_API_BASE_URL || "http://192.168.18.28:8000";
//const API_Base_url = import.meta.env.VITE_API_BASE_URL || "https://ems-server-530056698.us-central1.run.app" ;
//server url "https://ems-server-530056698.us-central1.run.app"


const urls = {
  getUserProjects: () => `${API_Base_url}/get_project_manager/${getUserIdFromLocalStorage()}/`, // Uses helper
  checkLastUpdate: `${API_Base_url}/check_last_update/`,
  toggleSensor: `${API_Base_url}/toogle_sensor/`,
  uploadImage: `${API_Base_url}/upload_image/`,
  updateImage: `${API_Base_url}/update_image/`,
  deleteImage: `${API_Base_url}/delete_images/`,
  deleteUser: (userId) => `${API_Base_url}/delete_user/${userId}/`,
  deleteGateway: `${API_Base_url}/delete_hardware`,
  updateUser: (userId) => `${API_Base_url}/update_user/${userId}/`, //update the user
  userData: (userId) => `${API_Base_url}/fetch_users/${userId}/`,
  fetchUser: `${API_Base_url}/fetch_users/`, //list of user shows to admin
  userCount: `${API_Base_url}/user_count/`, //total user count
  createUser: `${API_Base_url}/create_user/${getUserIdFromLocalStorage()}/`,
  createAdmin: `${API_Base_url}/create_admin/`, //create user
  getGatewayData: `${API_Base_url}/getgateway/`,
  apiPowerData: `${API_Base_url}/api/power-data/`, //create user
  getUserGateways: `${API_Base_url}/user_gateways/`,
  getAllGateways: `${API_Base_url}/get_all_gateways/`,
  loginUser: `${API_Base_url}/login_user/`, //for logging in
  createProject: `${API_Base_url}/create_project_manager/`, //project creation
  deleteMultiplleUser: `${API_Base_url}/delete_selected_user/`, //deleting multiple user
  totalProject: `${API_Base_url}/total_project/`, //total project count
  usertotalProject: `${API_Base_url}/get_user_project_count/${getUserIdFromLocalStorage()}/`, //total project count
  get_deployed_gateway_count: `${API_Base_url}/get_deployed_gateway_count/?user_id=${getUserIdFromLocalStorage()}`, // total project count
  fetch_highchart_data: `${API_Base_url}/fetch_highchart_data`,
  fetch_single_highchart_data: `${API_Base_url}/fetch_single_highchart_data`,
  fetchActiveProject: `${API_Base_url}/active_project/`, //active project count
  logout: `${API_Base_url}/logout/`,
  fetchBoxList: `${API_Base_url}/get_boxes/`, //fetching boxes list that are not usedd yet
  gatewayValueData: (gatewayName) =>
    `${API_Base_url}/fetch_value_data/${gatewayName}`,
  sentEmailreset: `${API_Base_url}/send_reset_code/`,
  totalGateways: `${API_Base_url}/get_all_gateways/`, //shows all gateway assigned deployed or free
  geUserProjects: (user_id) => `${API_Base_url}/get_project_manager/${user_id}/`, //getting project of user
  getToalProject: `${API_Base_url}/Get_All_Projects/`, //getting the total project list for admin
  createGateway: `${API_Base_url}/create_Gateways/`, //admin create gateway
  unassignedGateway: `${API_Base_url}/get_unassigned_gateways/`, //fetch un assigneed gateway later assign to any user
  assignGateway: `${API_Base_url}/assign_gateways_to_user/`, //assigning gateway to user
  userGateways: `${API_Base_url}/fetch_gateways_of_user/`, //fetching the gateway of user with whole data and empty coms
  userlistGateways: `${API_Base_url}/fetch_gateways_of_usersList/`, //user gateway dropdown in admin dashboard
  updateGateway: `${API_Base_url}/update_gateway/`, //only update the gateway status to deployed when user deploy it
  fetchDeployedGateways: `${API_Base_url}/fetch_deployed_gateways_of_user/`, //fetches only those status are deployed
  fetchTotalUserGateways: `${API_Base_url}/get_total_gateways_user/`, //fetches only those status are deployed
  Get_superAdmin_Project_Count: `${API_Base_url}/Get_superAdmin_Project_Count/`,
  totalGatewaysCount: `${API_Base_url}/get_total_gateways/`, //total gateways count
  deployedGatewaysCount: `${API_Base_url}/get_deployed_gateways/`, //deployed gateway count
  userAlotedGatewaysCount: `${API_Base_url}/get_user_aloted_gateways/`, // gateways aloted to user in admin dashboard dropdown
  fetch_Metadata: (gateway_name) =>
    `${API_Base_url}/fetch_metadata/?gateway=${gateway_name}`, //getting whole data and show in deployed gateway with coms

  totalSolar: `${API_Base_url}/Solar_project/`,
  totalgrid: `${API_Base_url}/Grid_project/`,
  totalGenset: `${API_Base_url}/Generator_project/`,
  gridexport: `${API_Base_url}/Grid_export_project/`,
  verifyOtp: `${API_Base_url}/verify_reset_code/`,

  fetchMetadataHighchart: (gateway_name, value_name, from_date, to_date) =>
    `${API_Base_url}/fetch_highchart_data/?gateway=${gateway_name}&value_name=${value_name}&from_date=${from_date}&to_date=${to_date}`, //high char data for specefic analyzer


  adminCount: `${API_Base_url}/admin_count/`,
  adminDetailsSuperAdmin: `${API_Base_url}/admin_detail_superadmin/`,
  adminDetails: `${API_Base_url}/admin_detail/`,
  CreateOrUpdateSubscription: `${API_Base_url}/create_or_update_subscription/`,
  Invoice: `${API_Base_url}/invoice/`,
  ep_plus_sum: (gatewayName) => `${API_Base_url}/api/ep_plus_sum/?gateway=${gatewayName}`,
  grid_import: (gatewayName) => `${API_Base_url}/Grid_import/?gateway=${gatewayName}`,
  solar_import: (gatewayName) => `${API_Base_url}/Solar_import/?gateway=${gatewayName}`,
  genset_import: (gatewayName) => `${API_Base_url}/Generator_import/?gateway=${gatewayName}`,
  grid_export: (gatewayName) => `${API_Base_url}/Grid_export/?gateway=${gatewayName}`,

  updateProject: `${API_Base_url}/edit_project_manager/`,


  getAnalyzerValuesByGateway: (gateway_name) => `${API_Base_url}/gateway/${gateway_name}/analyzers/`, //analyzers value for animation and for analyzer box dialog
  getGatewaysForDropdown: `${API_Base_url}/fetch_deployed_gateways_name_mac/`, //deployed gateway name and mac address for dropdown
};

export default urls;
