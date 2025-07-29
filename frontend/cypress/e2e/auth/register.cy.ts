describe('新規登録機能 E2Eテスト', () => {
  beforeEach(() => {
    // 各テスト前にセッションをクリア
    cy.clearSession();
  });

  it('正しい情報で新規登録できる', () => {
    const email = `registeruser_${Date.now()}@example.com`;
    const password = 'password123';
    
    cy.visit('/register');
    
    // フォームが表示されるまで待機
    cy.get('form').should('be.visible');
    
    cy.get('input[type="text"]').first().should('be.visible').type('新規登録テストユーザー');
    cy.get('input[type="email"]').should('be.visible').type(email);
    cy.get('input[type="password"]').first().should('be.visible').type(password);
    cy.get('input[type="password"]:last').should('be.visible').type(password);
    
    // 登録ボタンをクリック
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled').click();
    
    // ログインページに遷移することを確認
    cy.url().should('include', '/login');
    cy.contains('ログイン').should('exist');
  });

  it('パスワードが一致しない場合は登録できない', () => {
    const email = `registeruser_${Date.now()}@example.com`;
    
    cy.visit('/register');
    
    // フォームが表示されるまで待機
    cy.get('form').should('be.visible');
    
    cy.get('input[type="text"]').first().should('be.visible').type('新規登録テストユーザー');
    cy.get('input[type="email"]').should('be.visible').type(email);
    cy.get('input[type="password"]').first().should('be.visible').type('password123');
    cy.get('input[type="password"]:last').should('be.visible').type('differentpassword');
    
    // 登録ボタンをクリック
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('パスワードが一致しません').should('exist');
  });
});
