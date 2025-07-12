import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!, $password_confirmation: String!) {
    register(name: $name, email: $email, password: $password, password_confirmation: $password_confirmation) {
      id
      name
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logout
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`; 