const { expect } = require('@playwright/test');
const fs = require('fs');
const data = require('./data.js');

class ActionPageModel {
  constructor(testInfo, page, data) {
    this.testInfo = testInfo;
    this.page = page;
    this.data = data;
    this.locatorData = data.locatorData;
    this.testData = data.testData;
    this.siteData = data.siteData;
  }

  /**
   * Helper function to click an element if it's not empty.
   *
   * @param {string} elementLocator - The locator for the element to click.
   * @returns {Promise<void>} A promise that resolves after clicking the element if it's not empty.
   * @example
   * // Import the ActionPageModel
   * const ActionPageModel = require('./ActionPageModel');
   *
   * // Initialize your test and page objects
   * const testInfo =  Your test information ;
   * const page = Your page object ;
   *
   * // Create an instance of ActionPageModel
   * const actionPage = new ActionPageModel(testInfo, page,  Your data );
   *
   * // Example 1: Clicks on an element if the provided locator is not empty, undefined, or null.
   * await this.actionPage.clickIfNotEmpty(elementLocator);
   * // The function checks if elementLocator's value is not empty, undefined, or null.
   * // If the value is available in the DOM, it performs a click action.
   *
   */

  clickIfNotEmpty = async (elementLocator) => {
    const isValidElement = Boolean(elementLocator);
    if (isValidElement) {
      const trimmedLocator = elementLocator.trim();
      const result = await this.page.locator(trimmedLocator).first().count();

      // If element count is greater than zero, click on the first element
      if (result > 0) {
        await this.customClick(trimmedLocator);
        console.log(`${this.siteData.brandLocale} : Clicked the Element`);
      }
    }
  };

  /**
   * Function to search a checkbox element, wait for it to be visible and return its status
   * @param {string} elementLocator - The locator for the checkbox that will be verified.
   * @returns { elem , elementType, isChecked } - the locator to the checkbox element, its type and whether it's checked
   */
  verifyCheckboxStatus = async (elementLocator) => {
    const elem = await this.page.locator(elementLocator, {
      state: 'visible',
    });
    const elementType = await elem.getAttribute('type');
    const isChecked = await elem.isChecked();

    return { elem, elementType, isChecked };
  };

  /**
   * Function to verify a checkbox element and return true if it's already checked. No action is performed on the element
   * @param {string} checkboxLocator the element that will be verified and assessed
   */
  assertCheckboxIsChecked = async (checkboxLocator) => {
    const { isChecked } = await this.verifyCheckboxStatus(checkboxLocator);
    await expect(isChecked).toBe(true);
  };
  /**
   * Function to verify a checkbox element and return true if it's NOT checked. No action is performed on the element
   * @param {string} checkboxLocator the element that will be verified and assessed
   */
  assertCheckboxIsUnchecked = async (checkboxLocator) => {
    const { isChecked } = await this.verifyCheckboxStatus(checkboxLocator);
    await expect(isChecked).toBe(false);
  };

  /**
   * Helper function to check a checkbox if its not checked.
   *
   * @param {string} elementLocator - The locator for the checkbox to check.
   * @returns {Promise<void>} A promise that resolves after checking the checkbox if it's not checked.
   *
   */
  checkTheCheckBox = async (elementLocator) => {
    if (elementLocator) {
      const { elem, elementType, isChecked } =
        await this.verifyCheckboxStatus(elementLocator);

      if (!isChecked) {
        if (elementType !== 'checkbox') {
          await elem.dispatchEvent('click');
        } else {
          await elem.check();
        }
        console.log('Check box is selected manually');
      } else {
        console.log('Check box is selected automatically');
      }
    }
  };
  /**
   * Leverages Playwright's functions to locate an element with Accessibility role 'link' by its 'accessible name' and clicks on the first found.
   * @param {String} elementAccessibleName
   */
  clickOnLinkByAccessibleName = async (elementAccessibleName) => {
    await this.page
      .getByRole('link', { name: elementAccessibleName })
      .first()
      .click();
  };

  /**
   * Leverages Playwright's functions to locate an element with Accessibility role 'button' by its 'accessible name' and clicks on the first found.
   * @param {String} elementAccessibleName
   */
  clickOnButtonByAccessibleName = async (elementAccessibleName) => {
    await this.page
      .getByRole('button', { name: elementAccessibleName })
      .first()
      .click();
  };

  acceptJavaAlertPopup = async () => {
    await this.page.on('dialog', (dialog) => dialog.accept());
  };

  /**
   * click on the browser back arrow button
   */
  returnToPreviousPage = async () => {
    await this.page.goBack();
  };

  /**
   * Checks if an element identified by the provided selector is available on the page, then clicks it.
   *
   * @param {string} elementSelector - The selector for the element to be checked for availability and clicked.
   * @returns {Promise<void>} - A Promise that resolves after checking the availability of the element, clicking it, and logging the result.
   */
  isElementAvailableAndClick = async (elementSelector) => {
    for (let i = 0; i < elementSelector.length; i++) {
      const tempElem = elementSelector[i];
      if (tempElem) {
        await expect(await this.page.locator(tempElem).first()).toBeAttached();
        await this.customClick(tempElem);
        console.log('The element is present in the DOM and has been clicked');
      }
    }
  };

  /**
   * Checks if elements identified by the provided locators are available on the page.
   *
   * @param {string[]} locators - An array of selectors for elements to be checked for availability.
   * @param {string[]} customMessages - An array of custom messages corresponding to each element, used for logging.
   * @returns {Promise<void>} - A Promise that resolves after checking the availability of all specified elements and logging the results.
   */
  areElementsAvailable = async (locators, customMessages) => {
    for (let iCnt = 0; iCnt < locators.length; iCnt++) {
      const element = locators[iCnt];
      const message = customMessages[iCnt];
      if (element) {
        await expect(await this.page.locator(element).first()).toBeAttached();
        console.log(message + ' exists');
      }
    }
  };

  /**
   * Perform an action on a dropdown element.
   *
   * @function dropdown
   * @param {Object} options - The options for interacting with the dropdown.
   * @param {string} options.ddElem (Mandatory) -  The selector for the dropdown element.
   * @param {string} options.ddOptionElem (Optional) - The selector for a specific dropdown option element.
   * @param {string} options.ddOptionValueData (Optional) - Dropdown option value.
   * @param {number} options.ddOptionIndexData (Optional) - The index of the option to select.
   * @param {string} options.clickTypeFlagForDd - Click type flag for dropdown (optional, defaults to 'TRUE').
   * @returns {Promise<void>} - A Promise that resolves after the dropdown interaction is completed.
   *
   * @throws {Error} - If ddElem parameter is not provided.
   */

  dropdown = async ({
    ddElem,
    ddOptionElem,
    ddOptionValueData,
    ddOptionIndexData,
    clickTypeFlagForDd,
  }) => {
    // If ddElem & ddOptionElem is provided, click on the dropdown option element
    if (ddElem && ddOptionElem) {
      if (clickTypeFlagForDd === 'TRUE') {
        await this.page.locator(ddElem).click();
        await this.page.locator(ddOptionElem).waitFor();
        await this.page.locator(ddOptionElem).click();
        await this.page.waitForTimeout(2000);
      } else {
        await this.page.locator(ddElem).dispatchEvent('click');
        await this.page.locator(ddOptionElem).waitFor();
        await this.page.locator(ddOptionElem).dispatchEvent('click');
        await this.page.waitForTimeout(2000);
      }
    }
    // If ddElem & ddOptionValueData is provided, select the option by its value
    else if (ddElem && ddOptionValueData) {
      await this.page
        .locator(ddElem)
        .selectOption(ddOptionValueData, { force: true });
      // Static wait added because the next dropdown takes time to enable after selection
      await this.page.waitForTimeout(2000);
    }
    // If ddElem & ddOptionIndexData is provided, select the option by its index
    else if (ddElem && ddOptionIndexData) {
      const ddOptionIndex = parseInt(ddOptionIndexData, 10);
      await this.page
        .locator(ddElem)
        .selectOption({ index: ddOptionIndex }, { force: true });
      await this.page.waitForTimeout(2000);
    }
    // If ddElem is provided, click on the dropdown element and select the first option
    else if (ddElem) {
      const dropdownLocator = this.page.locator(ddElem);
      await expect(dropdownLocator).toBeEnabled({ timeout: 5000 });
      await this.page.locator(ddElem).click();
      await this.page.keyboard.down('ArrowDown');
      await this.page.keyboard.down('Enter');
    }
  };

  /**
   * Check if element is no longer visible on page (removed from DOM, visibility hidden, outside viewport, covered) on page after given timeout.
   * If not hidden until given timout abort the test script and fail.
   *
   * @param {string} elementSelector - Locator for the element to disappear.
   * @param {number} waitTime - Timeout in milliseconds.
   */
  waitForNotVisible = async (elementSelector, waitTime) => {
    const element = await this.page.locator(elementSelector).first();
    await expect.soft(element).toBeHidden({ timeout: waitTime });
  };

  /**
   * Check if element is visible on page (in DOM, in viewport, not covered) on page after given timeout.
   * If not visible until given timout abort the test script and fail.
   *
   * @param {string} elementSelector - Locator for the element to be visible.
   * @param {number} waitTime - Timeout in milliseconds.
   */
  waitForVisible = async (elementSelector, waitTime) => {
    const element = await this.page.locator(elementSelector).first();
    await expect.soft(element).toBeVisible({ timeout: waitTime });
  };

  /**
   * Will press a given key on a keyboard.
   *
   * @param {string} key - Keyboard key to press.
   */
  pressKeyboard = async (key) => {
    await this.page.keyboard.press(key);
  };

  /**
   * Scrolls to the top of the page.
   *
   */

  scrollToTop = async () => {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  };

  /**
   * Clicks on elements selected by the provided locators if they have a count greater than zero.
   * @async
   * @param {string[]} locators - An array of CSS or XPath locators identifying elements to be clicked.
   * @returns {Promise<void>} - A Promise that resolves once all eligible elements have been clicked.
   * @example
   * // Click on elements with locators ['.button', '#link'] if they have a count greater than zero.
   * await clickElementsWithCount(['.button', '#link']);
   */
  clickElementsWithCount = async (locators) => {
    for (let i = 0; i < locators.length; i++) {
      const tempElem = locators[i];
      if (tempElem) {
        // Get count of elements matching locator
        const result = await this.page.locator(tempElem).first().count();

        // If element count is greater than zero, click on the first element and log a message
        if (result > 0) {
          await this.page.locator(tempElem).first().dispatchEvent('click');
          console.log('The element is present in the DOM and has been clicked');
        }
      }
    }
  };

  /**
   * Select Stardust Dropdown component by option value
   *
   * @param {string} elementSelector - The selector for the element to be clicked and selected.
   * @param {string} value - The value of the element's option to be chosen.
   */
  selectStardustDropdown = async (elementSelector, value) => {
    if (value) {
      await this.page.locator(elementSelector).click();
      await this.page.getByRole('option', { name: value }).click();
    }
  };

  /**
   * Fill the input field with value
   *
   * @param {string} elementSelector - The selector for the element to be filled.
   * @param {string} value - The value to be filled.
   */
  fillInput = async (elementSelector, value) => {
    if (elementSelector) {
      const locator = await this.page.locator(elementSelector);
      await this.fillInputForElement(locator, value);
    }
  };

  /**
   * Base Fill the input field with value.(Do not click input controls)
   *
   * @param {string} elementSelector - The selector for the element to be filled.
   * @param {string} value - The value to be filled.
   */
  fillInputBase = async (elementSelector, value) => {
    if (elementSelector) {
      const locator = await this.page.locator(elementSelector);
      await this.fillInputForElementBase(locator, value);
    }
  };

  /**
   * Fills the input field with value for the appropriate element.
   *
   * @param {string} element - The selector for the element to be filled.
   * @param {string} value - The value to be filled.
   */
  fillInputForElement = async (element, value) => {
    await expect(element).toHaveCount(1);

    const isEditable = await element.isEditable();

    if (value && isEditable) {
      await element.click({ force: true });
      await element.fill(value);
    }
  };

  /**
   * Fills the input field with value for the appropriate element.(Do not click input controls)
   *
   * @param {string} element - The selector for the element to be filled.
   * @param {string} value - The value to be filled.
   */
  fillInputForElementBase = async (element, value) => {
    await expect(element).toHaveCount(1);

    const isEditable = await element.isEditable();

    if (value && isEditable) {
      await element.fill(value);
    }
  };

  /**
   * Click the button by element selector
   *
   * @param {string} elementSelector - The selector for the element to be clicked.
   */
  clickButtonByLocator = async (elementSelector) => {
    if (elementSelector) {
      const locator = await this.page.locator(elementSelector);

      await expect(locator).toHaveCount(1);
      await locator.click();
    }
  };

  /**
   * Check the Stardust checkbox component
   *
   * @param {string} elementSelector - The selector for the element to be checked.
   * @param {string} value - If there is not empty value then the element should be checked.
   */
  checkStardustCheckbox = async (elementSelector, value) => {
    const checkbox = await this.page.locator(elementSelector);
    await expect(checkbox).toHaveCount(1);

    if (value) {
      await checkbox.hover();
      await this.page.mouse.down();
      await this.page.mouse.up();
    }
  };

  /**
   * Select dropdown component by option value for pincer-iam dropdown using the latest version.
   *
   * @param {string} elementSelector - The selector for the element to be clicked and selected.
   * @param {string} value - The value of the element's option to be chosen.
   */
  selectDropdownV2 = async (elementSelector, value) => {
    const locator = await this.page.locator(elementSelector);

    await expect(locator).toHaveCount(1);

    if (value) {
      await locator.click();
      await locator.getByRole('option', { name: value }).click();
    }
  };

  /**
   * Will return searched attribute from given element on the page.
   *
   * @param {string} elementSelector - Locator for the element to get attribute.
   * @param {string} attribute - Searched attribute.
   * @returns {Promise<null|string>} - A value of the searched attribute.
   */
  getAttribute = async (elementSelector, attribute) => {
    return await this.page.locator(elementSelector).getAttribute(attribute);
  };

  /**
   * Asynchronously waits for a specified duration before continuing execution.
   * @param {string|number} timeToLoadElem - The duration to wait for in milliseconds.
   * @returns {Promise<void>} - A Promise that resolves when the wait is over.
   */
  loadTimeout = async (timeToLoadElem) => {
    if (timeToLoadElem) {
      // Parse as integer
      const time = parseInt(timeToLoadElem.toString().trim(), 10);
      if (!isNaN(time)) {
        await this.page.waitForTimeout(time);
      } else {
        await this.page.waitForTimeout(3000);
      }
    } else {
      return; // If timeToLoadElem is not provided or is falsy, return without waiting
    }
  };

  /**
   * Wait for an element to become visible within the specified timeout.
   * @param {string} elementSelector - The selector for the element to wait for.
   * @param {number} timeout - The maximum time to wait for the element to become visible, in milliseconds.
   */
  waitForElementVisible = async (elementSelector, timeout) => {
    const element = await this.page.locator(elementSelector).first();
    try {
      await expect(element).toBeVisible({ timeout });
    } catch (e) {
      console.log('The Element is not visible within the specified time');
    }
  };

  /**
   * Performs a write operation on the specified element, either by filling it with data or by pressing keys sequentially.
   *
   * @param {string} elementSelector - The selector for the element to interact with.
   * @param {string} data - The data to fill into the element or to be pressed sequentially.
   * @param {number} delayTime - The delay time in milliseconds used to wait for each character to get entered into input field
   * @returns {Promise<void>} - A Promise that resolves when the write operation is complete.
   */
  performWriteOperation = async (elementSelector, data, delayTime) => {
    if (elementSelector) {
      // TODO: Need to have fillOperation const under Utils or someother file
      const fillOperation = 'use_fill_api';
      if (elementSelector.includes(fillOperation)) {
        // Performing code for Fill
        await this.page.locator(elementSelector).fill(data);
      } else {
        // Perform Press Sequentially
        await this.page.locator(elementSelector).waitFor();
        await this.page.locator(elementSelector).click({ force: true });
        await this.page.locator(elementSelector).focus();
        await this.page.waitForTimeout(5000); // click wait and pressSequentially with delay for QAP-2706
        const delayWaitTime = parseInt(delayTime, 10);
        await this.page
          .locator(elementSelector)
          .pressSequentially(data, { delay: delayWaitTime });
      }
    }
  };

  /**
   * @async
   * Click within the iframe on any of the elements identified by locators.
   * @param {string} element - The selector of the element within the iframe to be clicked.
   * @param {string} iFrameElem - The selector of the iframe containing the target element.
   * @returns {Promise<void>} A promise that resolves after the click operation is completed.
   */
  clickElementInFrame = async (element, iFrameElem) => {
    if (element && iFrameElem) {
      const isVisible = await this.page.locator(iFrameElem).isVisible();
      if (isVisible) {
        await this.page.frameLocator(iFrameElem).locator(element).click();
      }
    }
  };

  /**
   * Selects the tab key if a condition is met.
   *
   * @param {boolean} locators - If true, the tab key will be pressed.
   * @returns {Promise<void>} - A Promise that resolves after pressing the tab key.
   */
  selectTab = async (locators) => {
    if (locators) {
      await this.page.keyboard.press('Tab');
    }
  };

  /**
   * Scrolls the page to the bottom.
   */
  scrollToBottom = async () => {
    await this.page.evaluate(() => {
      window.scrollBy(0, document.body.innerHeight);
    });
  };

  /**
   * To block or cancel the actions interfering the test scripts
   */
  cancelInterferingActions = async () => {
    await this.page.route('https://lptag.liveperson.net/**', (route) =>
      route.abort()
    );
  };

  /**
   * Adds custom styles declared in a custom css file across the page.
   *
   * @param {string} stylePath - Full path to the css file. Suggested location SOM/feature/css/file.css.
   * @returns {Promise<void>}
   */
  addCustomStyles = async (stylePath) => {
    await this.page.addStyleTag({ path: stylePath });
  };

  /**
   * Checks if an element identified by the provided selector is available on the page, then clicks it.
   *
   * @param {string} elementSelector - The selector for the element to be checked for availability and clicked.
   * @returns {Promise<void>} - A Promise that resolves after checking the availability of the element, clicking it, and logging the result.
   */
  isAvailableAndClick = async (elementSelector) => {
    await expect(
      await this.page.locator(elementSelector).first()
    ).toBeVisible();
    await this.page.locator(elementSelector).first().click();
  };

  /**
   * Checks if an iFrame element identified by the provided selector and Iframe locator is available on the page, then clicks it.
   *
   * @param {string} elementSelector - The selector for the element to be checked for availability and clicked.
   * @param {string} iFrameLocator - The selector from the Iframe for the element to be checked for availability and clicked.
   * @returns {Promise<void>} - A Promise that resolves after checking the availability of the element, clicking it, and logging the result.
   */
  isAvailableiFrame = async (elementSelector, iFrameLocator) => {
    await expect(
      await this.page
        .frameLocator(iFrameLocator)
        .locator(elementSelector)
        .first()
    ).toBeVisible();
  };

  /**
   * Performs a click operation on an element based on the specified selector and conditions.
   *
   * @param {string} elementSelector - The selector of the element to be clicked.
   *                                  This can include special keywords to trigger different click behaviors:
   *                                  - 'use_forceClick_api': Forces the click operation.
   *                                  - 'dispatchEvent_api': Uses `dispatchEvent` for the click.
   *                                  - 'use_position_api': Clicks on a specific position within the element.
   *                                  - 'use_force_location_api': Combines force click with position-based click.
   *                                  - If nothing is given: Works as Normal click operation.
   * @param {number} [dataPostion] - The data value used for the x and y coordinates when a position-based click is performed.
   * @param {string} iframeElem - Locator for the iframe feild.
   *
   * @returns {Promise<void>} - A promise that resolves when the click operation is completed.
   */

  customClick = async (elem, dataPostion = 0, iframeElem = '') => {
    const forceClick = 'use_forceClick_api';
    const dispatchEvent = 'use_dispatchEvent_api';
    const positionClick = 'use_position_api';
    const forcePostionClick = 'use_force_location_api';

    const clickPosition = parseInt(dataPostion, 10);

    if (!elem) return;

    let locatorElem;

    if (iframeElem) {
      locatorElem = await this.page
        .frameLocator(iframeElem)
        .locator(elem)
        .first();
    } else {
      locatorElem = await this.page.locator(elem).first();
    }

    if (elem.includes(forceClick)) {
      await locatorElem.click({ force: true });
    } else if (elem.includes(dispatchEvent)) {
      await locatorElem.dispatchEvent('click');
    } else if (elem.includes(positionClick)) {
      await locatorElem.click({
        position: { x: clickPosition, y: clickPosition },
      });
    } else if (elem.includes(forcePostionClick)) {
      await locatorElem.click({
        force: true,
        position: { x: clickPosition, y: clickPosition },
      });
    } else {
      // Perform another set of code if none of the conditions are met
      await locatorElem.click();
    }
  };

  randomLocatorPick = async (elementLocator, usedIndex = 0) => {
    const isValidElement = Boolean(elementLocator);
    if (isValidElement) {
      const trimmedLocator = elementLocator.trim();
      const count = await this.page.locator(trimmedLocator).count();

      // If element count is greater than zero, click on the random element
      if (count > 0) {
        let isVisible = false;
        let randomElement, randomIndex;

        // Try to find a visible element
        for (let i = 0; i < count * 2 && !isVisible; i++) {
          // Generate a random index
          randomIndex = Math.floor(Math.random() * count);

          // If already used, skip this loop and try again
          if (usedIndex.has(randomIndex)) continue;

          // Select the nth element
          randomElement = await this.page
            .locator(trimmedLocator)
            .nth(randomIndex);
          isVisible = await randomElement.isVisible();
        }

        if (isVisible) {
          usedIndex.add(randomIndex);
          await randomElement.click();
          return;
        } else {
          console.log(
            `${this.siteData.brandLocale} : No visible element found`
          );
        }
      }
    }
  };

  waitForInteraction = async (elem) => {
    if (elem) {
      try {
        await this.page.waitForSelector(elem);
        await this.clickIfNotEmpty(elem);
      } catch (e) {
        e;
      }
    }
  };

  /**
   * This will return an array of elements from given selectors.
   *
   * @param {string[]} elementSelectors - An array of locators that are to be masked.
   * @returns {Promise<Array>}
   */
  getLocators = async (elementSelectors) => {
    return elementSelectors.map((selector) => this.page.locator(selector));
  };

  /**
   * Visually asserts given element.
   *
   * @param {string} elemToBeChecked - Locator for the element to be visually asserted.
   * @param {Object} screenshotOptions - Options like max diff pixels, mask, etc -setup in scenario model
   * @param {string} customName - Required name for snapshot.
   * @returns {Promise<void>}
   */
  assertElementVisual = async (
    elemToBeChecked,
    screenshotOptions,
    customName
  ) => {
    if (!customName) {
      throw new Error('CUSTOM NAME FOR SNAPSHOT MUST BE PROVIDED');
    }
    const device = this.siteData.executionContext.platform.toUpperCase();
    const brandCommonLayout =
      this.siteData.executionContext.brandCommonLayout === 'true'
        ? true
        : false;
    // If brandCommonLayout is true, there will be one common golden snapshot across chosen brand.
    // Requires setting up on scenario level mask ignoring copy.
    const snapshotID = brandCommonLayout
      ? this.siteData.brandPrefix
      : this.siteData.brandLocale;
    const fileName = `${customName}-elem-${snapshotID}-${device}.png`;
    await expect
      .soft(this.page.locator(elemToBeChecked))
      .toHaveScreenshot(fileName, screenshotOptions);
  };

  /**
   * Visually asserts the page.
   *
   * @param {Object} screenshotOptions - Options like max diff pixels, mask, full page -setup in scenario model
   * @param {string} customName - Required name for snapshot.
   * @returns {Promise<void>}
   */
  assertPageVisual = async (screenshotOptions, customName) => {
    if (!customName) {
      throw new Error('CUSTOM NAME FOR SNAPSHOT MUST BE PROVIDED');
    }
    const device = this.siteData.executionContext.platform.toUpperCase();
    const fileName = `${customName}-page-${this.siteData.brandLocale}-${device}.png`;
    await expect.soft(this.page).toHaveScreenshot(fileName, screenshotOptions);
  };

  // TODO revisit this after updating the base-level POMs. @jjayaraman_elcomp @jchellia_elcomp @spattabi_elcomp
  /**
   * Logs a message to the console with the brand locale prefix from the instance's site data.
   *
   * @function log
   * @param {string} message - The message to log.
   * @this {Object} - The instance context containing `siteData.brandLocale`.
   */
  log(message) {
    const prefix = this.siteData?.brandLocale || 'UNKNOWN_LOCALE';
    console.log(`${prefix} : ${message}`);
  }

  /**
   * Depending on the provided flag. Will check for elements visibility based
   * on Playwright's toBeVisible function.
   * Creates a log after each successful assertion
   * @param {Object} elements Pair of names (key) and selectors (value) Name will be used for logging. Selectors must be in CSS or XPath format
   * @param {Boolean} shouldBeVisible Flag to check for visible or invisible elements, defaults to true
   */
  checkElementsVisibility = async (elements, shouldBeVisible = true) => {
    for (const [name, element] of Object.entries(elements)) {
      if (element) {
        if (shouldBeVisible) {
          await expect(this.page.locator(element)).toBeVisible();
          console.log(
            `${name}, exists, is not hidden and is not obscured by another element`
          );
        } else {
          await expect(this.page.locator(element)).not.toBeVisible();
          console.log(`${name} is not visible`);
        }
      }
    }
  };
  /**
   * To open a new tab in the existing browser
   * @param {Object} context Reference to the current browser
   */
  newTab = async (context) => {
    return await context.newPage();
  };
  /**
   * Fills a text input field located within an iframe.
   * @param {string} iFrameLocator - The selector or locator for the iframe.
   * @param {string} iFrameElementSelector - The selector for the input element inside the iframe.
   * @param {string} iFrameDatavalue - The value to input into the element.
   * @returns {Promise<void>} - A promise that resolves once the input field is filled.
   * Usage: Useful for handling form inputs that are embedded inside iframes using Playwright.
   */
  iFrameInputFill = async (
    iFrameLocator,
    iFrameElementSelector,
    iFrameDatavalue
  ) => {
    await this.page
      .frameLocator(iFrameLocator)
      .locator(iFrameElementSelector)
      .first()
      .fill(iFrameDatavalue);
  };
  /** instal csv parser using this command: npm install csv-parse
   *
   */
  readCsvFiles = async (filePath) => {
    const { parse } = require('csv-parse');
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, trim: true })) // columns:true to get objects instead of arrays
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    // Usage example
    // (async () => {
    //   try {
    //     const data = await readCsvFile('./data.csv');
    //     console.log(data);
    //   } catch (error) {
    //     console.error('Error reading CSV:', error);
    //   }
    // })();
  };

  /** // Convert array of objects to CSV string
   *
   */
  writeInCsvFile = async (filename) => {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map((obj) => Object.values(obj).join(',')).join('\n');
    const csvContent = headers + rows;

    // Write to file
    fs.writeFileSync(filename, csvContent, 'utf8');
    console.log(`Data written to ${filename}`);
  };
  /**
 * return [
      { name: 'Alice', age: 30, city: 'New York' },
      { name: 'Bob', age: 25, city: 'San Francisco' },
      { name: 'Charlie', age: 35, city: 'Los Angeles' }
    ];
  });

  // Write scraped data to CSV
  await writeDataToCSV('output.csv', data);
 */
  /**
   *
   */
  readFromJsFiles = async (filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content;
    } catch (err) {
      console.error('Error reading JS file:', err);
      return null;
    }
  };

  /**
   *
   */
  writeInJsFiles = async (filename, data) => {
    const dataString = JSON.stringify(data, null, 2);

    // Prepare the JS content as a module export
    const jsContent = `module.exports = ${dataString};\n`;

    // Write the content to the specified JS file
    fs.writeFileSync(filename, jsContent, 'utf-8');

    console.log(`Data successfully written to ${filename}`);
  };
  // Example usage:
  // const exampleData = {
  //   name: "Alice",
  //   age: 30,
  //   city: "New York"
  // };
  // writeDataToJsFile('outputData.js', exampleData);
}

module.exports = ActionPageModel;
