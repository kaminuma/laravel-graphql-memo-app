describe('TODOアプリ E2Eテスト', () => {
  it('TODOの新規追加・表示・削除ができる', () => {
    cy.visit('http://localhost:3000/todos');

    // 新規TODO追加
    cy.get('input[label="タイトル"], input[aria-label="タイトル"], input[name="タイトル"]').type('E2EテストTODO');
    cy.get('textarea[label="説明"], textarea[aria-label="説明"], textarea[name="説明"]').type('E2Eテスト説明');
    cy.contains('TODOを登録').click();

    // リストに反映される
    cy.contains('E2EテストTODO').should('exist');
    cy.contains('E2Eテスト説明').should('exist');

    // 削除ボタン押下→モーダル表示→OKで削除
    cy.contains('E2EテストTODO').parents('div[role="card"], .MuiCard-root').within(() => {
      cy.contains('削除').click();
    });
    cy.contains('本当に削除しますか？').should('exist');
    cy.contains('OK').click();

    // リストから消える
    cy.contains('E2EテストTODO').should('not.exist');
  });
}); 