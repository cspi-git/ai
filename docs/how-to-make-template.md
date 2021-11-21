<h1 align="center">Ai</h1>
<h4 align="center">How to make a Ai template</h4>

## Description
Ai mechanism is really simple yet powerful and to make your own template you will need a little programming knowledge. If you still can't understand it check [Ai templates](https://github.com/Original-Psych0/Ai-templates).

Make sure to not forget this:
+ resolve() - Make sure in every of your code It has a resolve function for the program to verify that the code has ended.
+ MakeQuest - This function works like Axios but It's customized. ```_MakeQuest_(url, options)```
+ tor - If your planning to make your own request thingy use this variable to get the Tor socks5 agent.

## Template template
```
information:
  name: Name of the template #Required
  id: ID of the template #Required
  description: Description of the template #Optional
  risk: Risk of the template(info, low, medium, high(critical)) #Required
  authors: Authors of the template #Required
  tags: Tags of the template #Required
  references: #Optional
    - References of the template
  pocs: #Optional
    - Proof of concepts of the template

code: | #Required
  NodeJS code that will be executed
```
