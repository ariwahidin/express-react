const BASE_PATH = '/react-frontend';

export const navigateTo = (path) => {
    window.location.href = `${BASE_PATH}${path}`;
}