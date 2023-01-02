import {isJsdomEnv, render} from '#testHelpers'
import DTL from '#src/_interop/dtl'

test('`Selection.setBaseAndExtent()` resets input selection in browser', async () => {
  const {element} = render<HTMLInputElement>(`<input value="foo"/>`, {
    selection: {focusOffset: 3},
  })
  expect(element.selectionStart).toBe(3)

  element.ownerDocument.getSelection()?.setBaseAndExtent(element, 0, element, 0)

  expect(element.selectionStart).toBe(isJsdomEnv() ? 3 : 0)
})

test('events are not guaranteed to be dispatched on same microtask in browser', async () => {
  const {element} = render<HTMLInputElement>(`<input value="foo"/>`)
  const onSelect = mocks.fn()
  element.addEventListener('select', onSelect)

  element.setSelectionRange(1, 2)

  expect(onSelect).toBeCalledTimes(isJsdomEnv() ? 1 : 0)

  await DTL.waitFor(() => expect(onSelect).toBeCalledTimes(1))
})
