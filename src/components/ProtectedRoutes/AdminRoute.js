import { isAuthenticated, userInfo } from "../../utils/auth";
import {Redirect, Route} from 'react-router-dom';

const AdminRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAuthenticated() ? (
            userInfo().role === 'admin' ? (
                children
            ) : <Redirect
                    to={{
                    pathname: "/user/dashboard",
                    state: { from: location }
                    }}
                />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
export default AdminRoute;
