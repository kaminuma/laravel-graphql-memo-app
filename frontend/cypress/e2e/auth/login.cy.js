describe('ログイン機能 E2Eテスト', () => {
  beforeEach(() => {
    // 各テスト前にセッションをクリア
    cy.clearSession();
  });

  it('既存ユーザーでログインできる', () => {
    const email = 'test@example.com';
    const password = 'password';
    
    // カスタムログインコマンドを使用
    cy.login(email, password);
    
    // 現在のURLを確認
    cy.url().should('include', '/todos');
    
    // ページの内容を確認
    cy.get('body').then(($body) => {
      cy.log('Page content:', $body.text());
    });
    
    // TODOページにいることを確認
    cy.contains('✨ TODO App').should('exist');
    
    // ログイン後の要素が表示されることを確認（ユーザーアバターとユーザー名）
    cy.get('button').contains('Test User').should('exist');
  });

  it('間違った認証情報ではログインできない', () => {
    cy.visit('/login');
    
    // フォームが表示されるまで待機
    cy.get('form', { timeout: 10000 }).should('be.visible');
    
    cy.get('input[type="email"]').should('be.visible').clear().type('wrong@example.com');
    cy.get('input[type="password"]').should('be.visible').clear().type('wrongpassword');
    
    // ログインボタンをクリック
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('Invalid credentials', { timeout: 10000 }).should('exist');
    
    // ログインページに留まっていることを確認
    cy.url().should('include', '/login');
  });
});
