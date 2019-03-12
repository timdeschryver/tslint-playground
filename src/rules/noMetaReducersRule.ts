import * as ts from 'typescript'
import * as Lint from 'tslint'
import { tsquery } from '@phenomnomnominal/tsquery'

export class Rule extends Lint.Rules.AbstractRule {
  static ruleName = 'no-meta-reducers'

  static failure =
    'Use the USER_PROVIDED_META_REDUCERS meta-reducer to provide custom meta-reducers'

  static queryImport =
    'ImportDeclaration ImportSpecifier > Identifier[name="META_REDUCERS"]'
  static queryAssignment =
    'PropertyAssignment > Identifier[name="META_REDUCERS"]'

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk)
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const hits = tsquery(ctx.sourceFile, Rule.queryAssignment, {
    visitAllChildren: true,
  })

  hits.forEach(hit => {
    const fix = Lint.Replacement.replaceFromTo(
      hit.getStart(),
      hit.getEnd(),
      'USER_PROVIDED_META_REDUCERS'
    )
    ctx.addFailure(hit.getStart(), hit.getEnd(), Rule.failure, fix)
  })
}
