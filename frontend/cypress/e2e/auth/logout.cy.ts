describe('ログアウト機能 E2Eテスト', () => {
  beforeEach(() => {
    // 各テスト前にセッションをクリア
    cy.clearSession();
  });

  it('ログイン後にログアウトできる', () => {
    const email = 'test@example.com';
    const password = 'password';
    
    // カスタムログインコマンドを使用
    cy.login(email, password);
    
    // ユーザー名が表示されるまで待機
    cy.contains('Test User').should('be.visible');
    
    // ログアウト
    cy.contains('Test User').click();
    cy.contains('ログアウト').should('be.visible').click();
    
    // ホームページに戻ることを確認
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('ログアウト後にTODOページにアクセスするとログイン画面にリダイレクトされる', () => {
    const email = 'test@example.com';
    const password = 'password';
    
    // カスタムログインコマンドを使用
    cy.login(email, password);
    
    // ユーザー名が表示されるまで待機
    cy.contains('Test User').should('be.visible');
    
    // ログアウト
    cy.contains('Test User').click();
    cy.contains('ログアウト').should('be.visible').click();
    
    // TODOページにアクセス
    cy.visit('/todos');
    
    // ログイン画面にリダイレクトされることを確認
    cy.url().should('include', '/login');
    cy.contains('ログイン').should('exist');
  });
});
