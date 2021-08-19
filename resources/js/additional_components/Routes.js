const HTTP_PROTOCOL = 'http'
const DOMAIN = 'localhost'
const H_DOMAIN = `${HTTP_PROTOCOL}://${DOMAIN}`

export const
    REACT_APP_LOGIN = `${H_DOMAIN}/api/login`,
    REACT_APP_TOKENCHECK = `${H_DOMAIN}/api/token/check`,
    REACT_APP_LOGOUT = `${H_DOMAIN}/api/logout`,
    REACT_APP_USER_INFO_GET = `${H_DOMAIN}/api/user/info`,
    REACT_APP_ADMIN_USER_CREDENTIALS = `${H_DOMAIN}/api/user/credentials`,
    REACT_APP_ADMIN_USER_EDIT_CREDENTIALS = `${H_DOMAIN}/api/user/credentials/edit`,

    REACT_APP_ADMIN_STUDENT_GET = `${H_DOMAIN}/api/student/find`,
    REACT_APP_ADMIN_STUDENTS_LIST_GET = `${H_DOMAIN}/api/student/list`,
    REACT_APP_ADMIN_ARCHIVED_STUDENTS_LIST_GET = `${H_DOMAIN}/api/student/getall_archived`,
    REACT_APP_ADMIN_STUDENT_EDIT = `${H_DOMAIN}/api/student/edit`,
    REACT_APP_ADMIN_STUDENT_EDIT_GETALL_GROUPS_ACTIVE = `${H_DOMAIN}/api/groups`,
    REACT_APP_ADMIN_GROUPS = `${H_DOMAIN}/api/group/all`,
    REACT_APP_ADMIN_STUDENTS_LINKED_TO_PRIKAZ = `${H_DOMAIN}/api/prikaz/students`,

    REACT_APP_ADMIN_FACULTETS_GET = `${H_DOMAIN}/api/facultet/list`,
    REACT_APP_ADMIN_EXPORT_DATA = `${H_DOMAIN}/api/student/export`,

    REACT_APP_ORDERS = `${H_DOMAIN}/api/orders/lk`,
    REACT_APP_ORDER_CANCEL = `${H_DOMAIN}/api/orders/cancel`,
    REACT_APP_ORDER_CREATE_SPRAVKA_OB_OBUCHENII = `${H_DOMAIN}/api/orders/create`,
    REACT_APP_ADMIN_ORDERS_LIST = `${H_DOMAIN}/api/orders/list`,
    REACT_APP_ADMIN_ORDERS_UPDATE = `${H_DOMAIN}/api/orders/update`,
    REACT_APP_ADMIN_ORDER_GENERATE_DOCUMENT = `${H_DOMAIN}/api/orders/prepare`,
    REACT_APP_ADMIN_ORDER_FULLFILL_DOCUMENT = `${H_DOMAIN}/api/orders/fullfill`,

    REACT_APP_ADMIN_DOWNLOAD = `${H_DOMAIN}/api/orders/download`,
    REACT_APP_ADMIN_DOWNLOAD_PREVIEW = `${H_DOMAIN}/api/order/preview`,
    REACT_APP_ADMIN_DOWNLOAD_EXCEL_DOCUMENT_BY_PATH = `${H_DOMAIN}/api/file_Excel`,
    REACT_APP_ADMIN_DOWNLOAD_WORD_DOCUMENT_BY_PATH = `${H_DOMAIN}/api/file_Word`,

    REACT_APP_ADMIN_GROUPS_LIST_GET = `${H_DOMAIN}/api/group/list`,
    REACT_APP_ADMIN_GROUPS_EDIT = `${H_DOMAIN}/api/group/edit`,
    REACT_APP_ADMIN_GROUPS_DELETE = `${H_DOMAIN}/api/group/delete`,
    REACT_APP_ADMIN_GROUPS_CREATE = `${H_DOMAIN}/api/group/create`,
    REACT_APP_ADMIN_PRIKAZ_ZACHISLENIE = `${H_DOMAIN}/api/prikaz/zachislenie`,
    REACT_APP_ADMIN_IMPORT_STUDENTS_TEMPLATE_PATH = `${H_DOMAIN}/api/file_path/import_students`,

    REACT_APP_ADMIN_PRIKAZ_LIST = `${H_DOMAIN}/api/prikaz/list`,
    REACT_APP_ADMIN_PRIKAZ_TYPES = `${H_DOMAIN}/api/prikaz/types`,
    REACT_APP_ADMIN_PRIKAZ_CREATE = `${H_DOMAIN}/api/prikaz/create`,
    REACT_APP_ADMIN_PRIKAZ_EDIT = `${H_DOMAIN}/api/prikaz/edit`,
    REACT_APP_ADMIN_PRIKAZ_DELETE = `${H_DOMAIN}/api/prikaz/delete`,

    REACT_APP_ADMIN_MODERATORS_GET = `${H_DOMAIN}/api/user/admins`,
    REACT_APP_ADMIN_MODERATORS_DELETE = `${H_DOMAIN}/api/user/admins`,
    REACT_APP_ADMIN_MODERATORS_CREATE = `${H_DOMAIN}/api/user/admins`,

    REACT_APP_SERVER_RESTART = `${H_DOMAIN}/restart.php`

