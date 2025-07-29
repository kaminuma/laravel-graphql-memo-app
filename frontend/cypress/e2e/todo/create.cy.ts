describe('TODO作成機能 E2Eテスト', () => {
  beforeEach(() => {
    // セッションをクリアしてからログイン
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    
    // ログイン処理
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type('test@example.com');
    cy.get('input[type="password"]').clear().type('password');
    cy.get('button[type="submit"]').click();
    
    // ログイン後の遷移を待機
    cy.url({ timeout: 15000 }).should('include', '/todos');
    
    // TODOページの要素が表示されるまで待機
    cy.contains('✨ TODO App', { timeout: 10000 }).should('exist');
    
    // ログイン状態が保持されていることを確認
    cy.get('button').contains('Test User', { timeout: 10000 }).should('exist');
    
    // セッションCookieが設定されているか確認
    cy.getCookie('laravel_session').should('exist');
  });

  it('新しいTODOを作成できる', () => {
    const todoTitle = 'E2EテストTODO';
    const todoDescription = 'E2Eテスト説明';
    
    // TODO作成フォームが表示されるまで待機
    cy.get('form', { timeout: 10000 }).should('be.visible');
    
    // TODO作成フォームに入力
    cy.get('input[placeholder="例: 買い物に行く"]').clear().type(todoTitle);
    cy.get('textarea[placeholder="例: 牛乳、パン、卵を買う"]').clear().type(todoDescription);
    cy.get('button[type="submit"]').contains('TODOを登録').click();
    
    // 作成されたTODOが表示されることを確認
    cy.contains(todoTitle, { timeout: 10000 }).should('exist');
    cy.contains(todoDescription).should('exist');
  });

  it('タイトルが空の場合はHTML5バリデーションが発動する', () => {
    // フォームが表示されるまで待機
    cy.get('form', { timeout: 10000 }).should('be.visible');

    // タイトルを明示的に空にして説明のみ入力
    cy.get('input[placeholder="例: 買い物に行く"]').clear();
    cy.get('textarea[placeholder="例: 牛乳、パン、卵を買う"]').clear().type('説明のみのTODO');

    // サブミットボタンをクリック
    cy.get('button[type="submit"]').contains('TODOを登録').click();

    // inputがinvalid状態であることを確認
    cy.get('input[placeholder="例: 買い物に行く"]').should('have.prop', 'validity').then(validity => {
      expect(validity.valueMissing).to.be.true;
    });

    // validationMessageが空でないことを確認（日本語・英語どちらでもOK）
    cy.get('input[placeholder="例: 買い物に行く"]').then($input => {
      const msg = $input[0].validationMessage;
      expect(msg).to.not.equal('');
      expect(msg).to.match(/このフィールドを入力してください|Please fill in this field|必須項目です/);
    });
  });
});
