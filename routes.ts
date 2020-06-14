const routes = require('next-routes')();
import { RouteParams } from 'next-routes';


routes.add('home', '/', 'index');

export const { Link, Router } = routes;


export const getURL = (name: string, params?: RouteParams): string =>
  routes['findAndGetUrls'](name, params).urls.as;

export const isValidURL = (url: string): boolean => !!routes['match'](url).route;
export const getRouteName = (url: string): string | null =>
  (isValidURL(url) && routes['match'](url).route.name) || null;


export default routes;


/*
<Link route='name'>...</Link>
<Link route='name' params={params}> ... </Link>
<Link route='/path/to/match'> ... </Link> */
