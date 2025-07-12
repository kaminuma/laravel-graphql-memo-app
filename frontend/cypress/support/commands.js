// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// シンプルなログイン用のカスタムコマンド
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/todos');
  cy.contains('✨ TODO App').should('exist');
});

// セッション情報をクリアするカスタムコマンド
Cypress.Commands.add('clearSession', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// ログイン状態を確認するカスタムコマンド
Cypress.Commands.add('checkLoginStatus', () => {
  cy.visit('/todos');
  cy.url().then(url => {
    if (url.includes('/login')) {
      cy.log('ログイン状態: 未ログイン');
    } else {
      cy.log('ログイン状態: ログイン済み');
    }
  });
}); 