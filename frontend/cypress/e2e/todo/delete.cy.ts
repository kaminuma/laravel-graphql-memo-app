describe('TODO削除機能 E2Eテスト', () => {
  beforeEach(() => {
    // セッションをクリアしてからログイン
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then(win => win.sessionStorage.clear());

    // ログイン
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type('test@example.com');
    cy.get('input[type="password"]').clear().type('password');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/todos');
    cy.contains('✨ TODO App', { timeout: 10000 }).should('exist');
    cy.get('button').contains('Test User', { timeout: 10000 }).should('exist');
    cy.getCookie('laravel_session').should('exist');

    // テスト用TODOを作成
    const todoTitle = '削除テストTODO';
    cy.get('form', { timeout: 10000 }).should('be.visible');
    cy.get('input[placeholder="例: 買い物に行く"]').clear().type(todoTitle);
    cy.get('textarea[placeholder="例: 牛乳、パン、卵を買う"]').clear().type('削除テスト説明');
    cy.get('button[type="submit"]').contains('TODOを登録').click();
    cy.contains(todoTitle, { timeout: 10000 }).should('exist');
  });

  it('TODOを削除できる', () => {
    const todoTitle = '削除テストTODO';
    
    // TODOが存在することを確認
    cy.contains(todoTitle).should('exist');
    
    // 削除ボタンを直接クリック
    cy.get('button').contains('削除').first().should('be.visible').click();
    
    // ダイアログが表示されるまで待機
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible');
    
    // ダイアログのタイトルと本文を両方確認
    cy.contains('本当に削除しますか？', { timeout: 10000 }).should('exist');
    cy.contains('このTODOを本当に削除してもよろしいですか？この操作は取り消せません。', { timeout: 10000 }).should('exist');
    
    // キャンセルとOKボタンが表示されていることを確認
    cy.contains('キャンセル').should('be.visible');
    cy.contains('OK').should('be.visible');
    
    // OKボタンをクリックして削除を実行
    cy.contains('OK').should('be.visible').click();
    
    // ダイアログが閉じることを確認
    cy.get('[role="dialog"]').should('not.exist');
    
    // TODOが削除されたことを確認
    cy.contains(todoTitle).should('not.exist');
  });

  it('削除確認ダイアログでキャンセルできる', () => {
    const todoTitle = '削除テストTODO';
    
    // TODOが存在することを確認
    cy.contains(todoTitle).should('exist');
    
    // 削除ボタンを直接クリック
    cy.get('button').contains('削除').first().should('be.visible').click();
    
    // ダイアログが表示されるまで待機
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible');
    
    // ダイアログのタイトルと本文を両方確認
    cy.contains('本当に削除しますか？', { timeout: 10000 }).should('exist');
    cy.contains('このTODOを本当に削除してもよろしいですか？この操作は取り消せません。', { timeout: 10000 }).should('exist');
    
    // キャンセルとOKボタンが表示されていることを確認
    cy.contains('キャンセル').should('be.visible');
    cy.contains('OK').should('be.visible');
    
    // キャンセルボタンをクリック
    cy.contains('キャンセル').should('be.visible').click();
    
    // ダイアログが閉じることを確認
    cy.get('[role="dialog"]').should('not.exist');
    
    // TODOが残っていることを確認
    cy.contains(todoTitle).should('exist');
  });

  it('削除ボタンが正しく表示される', () => {
    const todoTitle = '削除テストTODO';
    
    // TODOが存在することを確認
    cy.contains(todoTitle).should('exist');
    
    // 削除ボタンが表示されていることを確認
    cy.get('button').contains('削除').should('be.visible');
    cy.get('button').contains('削除').should('not.be.disabled');
  });
});
