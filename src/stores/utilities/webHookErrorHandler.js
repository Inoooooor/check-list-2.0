export default function (hdeVars) {
  const hdeVarsEntries = Object.entries(hdeVars)

  const getWebhook = () =>
    hdeVarsEntries.find((variable) => variable[0] === 'webHook')

  const webHook = getWebhook()

  if (!webHook) throw new Error('Отстутствует переменная Webhook')
  if (!webHook[1]) throw new Error('Отстутствует значение переменной Webhook')
  // if ()
}
